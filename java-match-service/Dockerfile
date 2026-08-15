# ── Build stage: compile the Spring Boot JAR (no local JDK/Maven needed) ──────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ── Run stage: Spring Boot behind the AWS Lambda Web Adapter ──────────────────
# The Lambda Web Adapter lets a normal web server (Spring Boot on :8080) run in
# AWS Lambda with a Function URL — no code changes, scales to zero.
FROM public.ecr.aws/docker/library/eclipse-temurin:17-jre
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

ENV PORT=8080
ENV AWS_LWA_PORT=8080
ENV AWS_LWA_READINESS_CHECK_PATH=/api/health

WORKDIR /app
COPY --from=build /app/target/jd-match-service-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
