#!/usr/bin/env bash
# Deploy the static Next.js export (out/) to an S3 static website.
# Usage: BUCKET=my-bucket REGION=ap-southeast-2 bash infra/deploy-s3.sh
set -euo pipefail

BUCKET="${BUCKET:?set BUCKET, e.g. resume-oliver-wang}"
REGION="${REGION:-ap-southeast-2}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "▸ Building static export…"
cd "$ROOT"
npm run build

echo "▸ Ensuring bucket s3://$BUCKET ($REGION)…"
if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \
    --create-bucket-configuration LocationConstraint="$REGION"
fi

# Allow public read for website hosting.
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false

aws s3api put-bucket-policy --bucket "$BUCKET" --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Sid\": \"PublicReadGetObject\",
    \"Effect\": \"Allow\",
    \"Principal\": \"*\",
    \"Action\": \"s3:GetObject\",
    \"Resource\": \"arn:aws:s3:::$BUCKET/*\"
  }]
}"

aws s3 website "s3://$BUCKET" --index-document index.html --error-document 404.html

echo "▸ Uploading out/…"
# The /api/resume file has no extension; give it a JSON content-type.
aws s3 sync out/ "s3://$BUCKET" --delete --exclude "api/resume"
aws s3 cp out/api/resume "s3://$BUCKET/api/resume" --content-type "application/json"

echo "✓ Deployed: http://$BUCKET.s3-website-$REGION.amazonaws.com/"
