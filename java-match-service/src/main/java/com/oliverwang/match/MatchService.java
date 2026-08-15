package com.oliverwang.match;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * Scores a job description against the resume's skills.
 *
 * Same algorithm as the TypeScript lib/match.ts: for each skill keyword, split
 * it into searchable tokens (dropping parenthetical notes, splitting on / , &),
 * and count a match if any token appears in the lower-cased JD text. The score
 * is matched / total as a 0..100 percentage.
 */
@Service
public class MatchService {

    public MatchResult score(String jobDescription) {
        String haystack = jobDescription == null ? "" : jobDescription.toLowerCase(Locale.ROOT);

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : SkillCatalog.SKILLS) {
            boolean hit = tokensFor(skill).stream().anyMatch(haystack::contains);
            (hit ? matched : missing).add(skill);
        }

        int total = SkillCatalog.SKILLS.size();
        int score = total == 0 ? 0 : Math.round((matched.size() * 100.0f) / total);
        return new MatchResult(score, matched, missing, total);
    }

    /** "Node.js / Express" -> ["node.js", "express"]; drops "(...)" notes. */
    static List<String> tokensFor(String skill) {
        String cleaned = skill.toLowerCase(Locale.ROOT).replaceAll("\\(.*?\\)", " ");
        List<String> tokens = new ArrayList<>();
        for (String part : cleaned.split("[/,&]|\\s+—\\s+")) {
            String t = part.trim();
            if (t.length() >= 2) tokens.add(t);
        }
        return tokens.isEmpty() ? Arrays.asList(cleaned.trim()) : tokens;
    }

    /** Immutable response payload serialized to JSON by Spring. */
    public record MatchResult(int score, List<String> matched, List<String> missing, int total) {}
}
