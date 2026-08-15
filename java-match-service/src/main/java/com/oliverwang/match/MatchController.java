package com.oliverwang.match;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for the JD-Match service.
 *
 *   GET  /api/health           -> { "status": "ok" }
 *   POST /api/match            -> { score, matched[], missing[], total }
 *        body: { "jobDescription": "..." }
 *
 * CORS is open so the static S3-hosted front end can call it from the browser.
 */
@RestController
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/api/health")
    public Health health() {
        return new Health("ok");
    }

    @PostMapping("/api/match")
    public MatchService.MatchResult match(@RequestBody MatchRequest request) {
        return matchService.score(request.jobDescription());
    }

    public record MatchRequest(String jobDescription) {}

    public record Health(String status) {}
}
