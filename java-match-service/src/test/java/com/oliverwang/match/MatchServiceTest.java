package com.oliverwang.match;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MatchServiceTest {

    private final MatchService service = new MatchService();

    @Test
    void scoresStrongJdHighly() {
        String jd = "Senior Full-Stack Engineer. Java, Spring Boot, React, Next.js, TypeScript, "
                + "REST APIs, microservices, SQL, Oracle, Docker, AWS, OAuth 2.0, Claude Code.";
        MatchService.MatchResult r = service.score(jd);
        assertTrue(r.score() >= 40, "expected a decent match, got " + r.score());
        assertTrue(r.matched().contains("Java"));
        assertTrue(r.matched().contains("React"));
    }

    @Test
    void scoresEmptyJdAsZero() {
        MatchService.MatchResult r = service.score("");
        assertEquals(0, r.score());
        assertEquals(r.total(), r.missing().size());
    }

    @Test
    void tokenizerDropsParentheticalNotes() {
        assertTrue(MatchService.tokensFor("AWS (Lambda, API Gateway, S3)").contains("aws"));
    }
}
