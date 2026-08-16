package com.oliverwang.match;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MatchServiceTest {

    private final MatchService service = new MatchService();

    @Test
    void coversJdSkillsAndSurfacesGaps() {
        // JD asks for React (have) + Kubernetes (gap).
        MatchService.MatchResult r = service.score("We need React and Kubernetes.");
        assertEquals(2, r.jdTotal());
        assertTrue(r.matched().contains("React"));
        assertTrue(r.gaps().contains("Kubernetes"));
        assertEquals(50, r.score()); // 1 of 2 JD skills covered
    }

    @Test
    void resumeOnlySkillsAreOverflowNotPenalty() {
        // JD only asks for React (which the resume has) -> 100%, everything else is overflow.
        MatchService.MatchResult r = service.score("Looking for a React developer.");
        assertEquals(100, r.score());
        assertTrue(r.gaps().isEmpty());
        assertFalse(r.overflow().isEmpty());
        assertTrue(r.overflow().contains("Python")); // a resume skill the JD didn't ask for
    }

    @Test
    void javaTokenDoesNotMatchJavaScript() {
        MatchService.MatchResult r = service.score("Strong JavaScript required.");
        assertTrue(r.matched().contains("JavaScript"));
        assertFalse(r.matched().contains("Java"));
    }

    @Test
    void emptyJdScoresZero() {
        MatchService.MatchResult r = service.score("");
        assertEquals(0, r.score());
        assertEquals(0, r.jdTotal());
    }

    @Test
    void orRequirementCountsAsOneCoveredWhenEitherIsHeld() {
        // "React or Angular": resume has React -> one covered requirement, no gap.
        MatchService.MatchResult r = service.score("Front-end with React or Angular.");
        assertEquals(1, r.jdTotal());
        assertEquals(100, r.score());
        assertTrue(r.matched().contains("React"));
        assertTrue(r.gaps().isEmpty());
    }

    @Test
    void orRequirementIsOneGapWhenNeitherIsHeld() {
        // "Kubernetes or OpenShift": resume has neither -> a single gap, not two.
        MatchService.MatchResult r = service.score("Container orchestration with Kubernetes or OpenShift.");
        assertEquals(1, r.jdTotal());
        assertEquals(0, r.score());
        assertEquals(1, r.gaps().size());
        assertEquals("Kubernetes / OpenShift", r.gaps().get(0));
    }
}
