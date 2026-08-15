package com.oliverwang.match;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Scores JD COVERAGE: matched / (all JD skills detected). Resume skills the JD
 * does not ask for are "overflow" — surfaced but never lowering the score.
 * Same model as lib/match.ts.
 */
@Service
public class MatchService {

    public MatchResult score(String jobDescription) {
        String jd = jobDescription == null ? "" : jobDescription;

        // Skills the JD asks for (from the dictionary).
        List<String> jdSkills = new ArrayList<>();
        for (Map.Entry<String, List<String>> e : SkillCatalog.DICT.entrySet()) {
            if (e.getValue().stream().anyMatch(tok -> hasToken(jd, tok))) {
                jdSkills.add(e.getKey());
            }
        }

        List<String> matched = new ArrayList<>();
        List<String> gaps = new ArrayList<>();
        for (String s : jdSkills) {
            (SkillCatalog.RESUME_SKILLS.contains(s) ? matched : gaps).add(s);
        }

        // Overflow: resume skills the JD did not ask for (bonus, non-penalizing).
        List<String> overflow = new ArrayList<>();
        for (Map.Entry<String, List<String>> e : SkillCatalog.DICT.entrySet()) {
            String name = e.getKey();
            if (SkillCatalog.RESUME_SKILLS.contains(name) && !jdSkills.contains(name)) {
                overflow.add(name);
            }
        }

        int jdTotal = jdSkills.size();
        int score = jdTotal == 0 ? 0 : Math.round((matched.size() * 100.0f) / jdTotal);
        return new MatchResult(score, matched, gaps, overflow, jdTotal);
    }

    /** Word-boundary token match, so "java" does not match "javascript", etc. */
    static boolean hasToken(String text, String token) {
        String esc = Pattern.quote(token);
        Pattern p = Pattern.compile("(^|[^a-z0-9+#.])" + esc + "([^a-z0-9+#]|$)", Pattern.CASE_INSENSITIVE);
        return p.matcher(text.toLowerCase(Locale.ROOT)).find();
    }

    /** Immutable response payload serialized to JSON by Spring. */
    public record MatchResult(int score, List<String> matched, List<String> gaps, List<String> overflow, int jdTotal) {}
}
