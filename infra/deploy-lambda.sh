#!/usr/bin/env bash
# Deploy the Java (Spring Boot) JD-Match service to AWS Lambda as a container
# image with a public Function URL, using the AWS Lambda Web Adapter.
#
# Prereqs: Docker running, AWS CLI authenticated.
# Usage:   REGION=ap-southeast-2 bash infra/deploy-lambda.sh
set -euo pipefail

REGION="${REGION:-ap-southeast-2}"
ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"
REPO="jd-match-service"
FUNC="jd-match-service"
REGISTRY="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"
IMAGE="$REGISTRY/$REPO:latest"
ROLE_NAME="jd-match-lambda-role"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "▸ Ensuring ECR repo…"
aws ecr describe-repositories --repository-names "$REPO" --region "$REGION" >/dev/null 2>&1 \
  || aws ecr create-repository --repository-name "$REPO" --region "$REGION" >/dev/null

echo "▸ Building + pushing image…"
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REGISTRY"
docker build --platform linux/amd64 -t "$IMAGE" "$ROOT/java-match-service"
docker push "$IMAGE"

echo "▸ Ensuring IAM execution role…"
if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role --role-name "$ROLE_NAME" \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
  aws iam attach-role-policy --role-name "$ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  echo "  waiting for role propagation…"; sleep 10
fi
ROLE_ARN="arn:aws:iam::$ACCOUNT:role/$ROLE_NAME"

echo "▸ Creating/updating Lambda function…"
if aws lambda get-function --function-name "$FUNC" --region "$REGION" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$FUNC" --image-uri "$IMAGE" --region "$REGION" >/dev/null
else
  aws lambda create-function --function-name "$FUNC" \
    --package-type Image --code ImageUri="$IMAGE" --role "$ROLE_ARN" \
    --timeout 30 --memory-size 1024 --region "$REGION" >/dev/null
fi
aws lambda wait function-updated --function-name "$FUNC" --region "$REGION"

echo "▸ Ensuring public Function URL (CORS open)…"
aws lambda create-function-url-config --function-name "$FUNC" --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}' --region "$REGION" >/dev/null 2>&1 || \
aws lambda update-function-url-config --function-name "$FUNC" --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}' --region "$REGION" >/dev/null
aws lambda add-permission --function-name "$FUNC" --statement-id public-url \
  --action lambda:InvokeFunctionUrl --principal '*' --function-url-auth-type NONE --region "$REGION" >/dev/null 2>&1 || true

URL="$(aws lambda get-function-url-config --function-name "$FUNC" --region "$REGION" --query FunctionUrl --output text)"
echo "✓ Java JD-Match service deployed: $URL"
echo "  health: curl ${URL}api/health"
