package com.oliverwang.match;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Skill dictionary (canonical name -> match tokens) plus the resume's own skill
 * set. Mirrors lib/match.ts so the Java service and the browser produce the same
 * JD-coverage score. The dictionary includes skills the resume may NOT have, so
 * a JD's gaps are detectable.
 */
public final class SkillCatalog {

    private SkillCatalog() {}

    public static final Map<String, List<String>> DICT = new LinkedHashMap<>();

    static {
        DICT.put("Python", List.of("python"));
        DICT.put("Java", List.of("java"));
        DICT.put("TypeScript", List.of("typescript"));
        DICT.put("JavaScript", List.of("javascript"));
        DICT.put("Swift", List.of("swift", "swiftui"));
        DICT.put("Kotlin", List.of("kotlin"));
        DICT.put("Dart", List.of("dart"));
        DICT.put("Go", List.of("golang", "go"));
        DICT.put("C#", List.of("c#"));
        DICT.put(".NET", List.of(".net", "dotnet"));
        DICT.put("C++", List.of("c++"));
        DICT.put("Ruby", List.of("ruby"));
        DICT.put("PHP", List.of("php"));
        DICT.put("Scala", List.of("scala"));
        DICT.put("Rust", List.of("rust"));
        DICT.put("SQL", List.of("sql"));
        DICT.put("HTML", List.of("html"));
        DICT.put("CSS", List.of("css"));
        DICT.put("React", List.of("react"));
        DICT.put("Angular", List.of("angular"));
        DICT.put("Vue", List.of("vue"));
        DICT.put("Next.js", List.of("next.js", "nextjs"));
        DICT.put("Tailwind CSS", List.of("tailwind"));
        DICT.put("Flutter", List.of("flutter"));
        DICT.put("FastAPI", List.of("fastapi"));
        DICT.put("Node.js", List.of("node.js", "nodejs", "node"));
        DICT.put("Express", List.of("express"));
        DICT.put("Spring Boot", List.of("spring boot", "springboot", "spring"));
        DICT.put("REST APIs", List.of("rest api", "restful", "rest"));
        DICT.put("GraphQL", List.of("graphql"));
        DICT.put("gRPC", List.of("grpc"));
        DICT.put("SOAP", List.of("soap"));
        DICT.put("Microservices", List.of("microservice"));
        DICT.put("Serverless", List.of("serverless"));
        DICT.put("Kafka", List.of("kafka"));
        DICT.put("RabbitMQ", List.of("rabbitmq"));
        DICT.put("ActiveMQ", List.of("activemq"));
        DICT.put("JMS", List.of("jms"));
        DICT.put("Oracle", List.of("oracle"));
        DICT.put("PL/SQL", List.of("pl/sql", "plsql"));
        DICT.put("PostgreSQL", List.of("postgresql", "postgres"));
        DICT.put("MySQL", List.of("mysql"));
        DICT.put("SQLite", List.of("sqlite"));
        DICT.put("MongoDB", List.of("mongodb", "mongo"));
        DICT.put("Redis", List.of("redis"));
        DICT.put("Firebase", List.of("firebase", "firestore"));
        DICT.put("Snowflake", List.of("snowflake"));
        DICT.put("Databricks", List.of("databricks"));
        DICT.put("Docker", List.of("docker"));
        DICT.put("Kubernetes", List.of("kubernetes", "k8s"));
        DICT.put("OpenShift", List.of("openshift"));
        DICT.put("Helm", List.of("helm"));
        DICT.put("Terraform", List.of("terraform"));
        DICT.put("Ansible", List.of("ansible"));
        DICT.put("Git", List.of("git"));
        DICT.put("GitLab", List.of("gitlab"));
        DICT.put("CI/CD", List.of("ci/cd", "cicd", "continuous integration"));
        DICT.put("Jenkins", List.of("jenkins"));
        DICT.put("Maven", List.of("maven"));
        DICT.put("Gradle", List.of("gradle"));
        DICT.put("JUnit", List.of("junit"));
        DICT.put("Playwright", List.of("playwright"));
        DICT.put("Selenium", List.of("selenium"));
        DICT.put("AWS", List.of("aws", "amazon web services"));
        DICT.put("Lambda", List.of("lambda"));
        DICT.put("API Gateway", List.of("api gateway"));
        DICT.put("S3", List.of("s3"));
        DICT.put("Azure", List.of("azure"));
        DICT.put("Google Cloud", List.of("gcp", "google cloud"));
        DICT.put("Cloud Run", List.of("cloud run"));
        DICT.put("OAuth", List.of("oauth"));
        DICT.put("OpenID Connect", List.of("openid", "oidc"));
        DICT.put("JWT", List.of("jwt"));
        DICT.put("Splunk", List.of("splunk"));
        DICT.put("Grafana", List.of("grafana"));
        DICT.put("Prometheus", List.of("prometheus"));
        DICT.put("Kibana", List.of("kibana"));
        DICT.put("Elasticsearch", List.of("elasticsearch", "elastic search"));
        DICT.put("Hibernate", List.of("hibernate"));
        DICT.put("JPA", List.of("jpa"));
        DICT.put("JDBC", List.of("jdbc"));
        DICT.put("Nginx", List.of("nginx"));
        DICT.put("OpenAI", List.of("openai", "gpt"));
        DICT.put("Anthropic Claude", List.of("claude", "anthropic"));
        DICT.put("RAG", List.of("rag", "retrieval-augmented", "retrieval augmented"));
        DICT.put("MCP", List.of("mcp", "model context protocol"));
        DICT.put("Agile / Scrum", List.of("agile", "scrum"));
        DICT.put("Jira", List.of("jira"));
        DICT.put("Confluence", List.of("confluence"));
    }

    /** The canonical skills this resume has (matches the resume's Technical Skills). */
    public static final Set<String> RESUME_SKILLS = Set.of(
            "Python", "Java", "TypeScript", "JavaScript", "Swift", "Dart", "SQL", "HTML", "CSS",
            "React", "Next.js", "Tailwind CSS", "Flutter",
            "FastAPI", "Node.js", "Express", "REST APIs", "Microservices", "Serverless",
            "Oracle", "PL/SQL", "SQLite", "MongoDB", "Firebase",
            "Docker", "Git", "Terraform", "AWS", "Lambda", "API Gateway", "S3",
            "Google Cloud", "Cloud Run", "OAuth", "OpenID Connect", "JWT",
            "OpenAI", "Anthropic Claude", "RAG", "MCP"
    );
}
