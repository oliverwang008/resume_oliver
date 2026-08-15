package com.oliverwang.match;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the JD-Match REST microservice.
 *
 * This is the "Java feature" of the resume web app: a Spring Boot service that
 * exposes POST /api/match to score a pasted job description against Oliver
 * Wang's resume skills. It implements the same algorithm as lib/match.ts, so
 * the Next.js front end can call this service (via NEXT_PUBLIC_API_URL) or fall
 * back to the in-browser scorer.
 */
@SpringBootApplication
public class JdMatchApplication {
    public static void main(String[] args) {
        SpringApplication.run(JdMatchApplication.class, args);
    }
}
