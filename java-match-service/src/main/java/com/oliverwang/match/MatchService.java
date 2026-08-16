package com.oliverwang.match;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Scores JD COVERAGE by REQUIREMENT. Skills joined by "or"/"/" (e.g. "React or
 * Angular") collapse into one requirement, covered if the resume has ANY of the
 * alternatives. Resume skills the JD doesn't ask for are non-penalizing overflow.
 * Same model as lib/match.ts.
 */
@Service
public class MatchService {

    public MatchResult score(String jobDescription) {
        String jd = jobDescription == null ? "" : jobDescription.toLowerCase(Locale.ROOT);

        List<List<String>> groups = requirements(jd);

        Set<String> jdSkills = new LinkedHashSet<>();
        groups.forEach(jdSkills::addAll);

        List<String> matched = new ArrayList<>();
        List<String> gaps = new ArrayList<>();
        for (List<String> group : groups) {
            List<String> covered = group.stream().filter(SkillCatalog.RESUME_SKILLS::contains).toList();
            if (!covered.isEmpty()) matched.add(String.join(" / ", covered));
            else gaps.add(String.join(" / ", group));
        }

        List<String> overflow = new ArrayList<>();
        for (String name : SkillCatalog.DICT.keySet()) {
            if (SkillCatalog.RESUME_SKILLS.contains(name) && !jdSkills.contains(name)) overflow.add(name);
        }

        int jdTotal = groups.size();
        int score = jdTotal == 0 ? 0 : Math.round((matched.size() * 100.0f) / jdTotal);
        return new MatchResult(score, matched, gaps, overflow, jdTotal);
    }

    /** Group the JD's skills into requirements (alternations collapse to one). */
    static List<List<String>> requirements(String jdLower) {
        List<Hit> hits = orderedHits(jdLower);
        List<List<String>> groups = new ArrayList<>();
        List<Hit> seg = new ArrayList<>();
        for (int i = 0; i < hits.size(); i++) {
            Hit h = hits.get(i);
            String conn = i < hits.size() - 1 ? connectorType(jdLower.substring(h.end, hits.get(i + 1).start)) : "other";
            seg.add(new Hit(h.name, h.start, h.end, conn));
            if (conn.equals("other")) { flush(seg, groups); seg = new ArrayList<>(); }
        }
        flush(seg, groups);
        return groups;
    }

    private static void flush(List<Hit> seg, List<List<String>> groups) {
        if (seg.isEmpty()) return;
        boolean hasOr = seg.stream().anyMatch(h -> "or".equals(h.conn));
        if (hasOr) {
            List<String> g = new ArrayList<>();
            seg.forEach(h -> g.add(h.name));
            groups.add(g);
        } else {
            seg.forEach(h -> groups.add(List.of(h.name)));
        }
    }

    /** Each canonical skill present, with the position of its first mention, ordered. */
    static List<Hit> orderedHits(String jdLower) {
        List<Hit> hits = new ArrayList<>();
        for (Map.Entry<String, List<String>> e : SkillCatalog.DICT.entrySet()) {
            int best = -1, bestEnd = -1;
            for (String token : e.getValue()) {
                Matcher m = boundary(token).matcher(jdLower);
                if (m.find()) {
                    int start = m.start(2);
                    if (best == -1 || start < best) { best = start; bestEnd = m.end(2); }
                }
            }
            if (best != -1) hits.add(new Hit(e.getKey(), best, bestEnd, null));
        }
        hits.sort((a, b) -> Integer.compare(a.start, b.start));
        return hits;
    }

    private static Pattern boundary(String token) {
        return Pattern.compile("(^|[^a-z0-9+#.])(" + Pattern.quote(token) + ")([^a-z0-9+#]|$)", Pattern.CASE_INSENSITIVE);
    }

    static String connectorType(String gap) {
        String core = gap.replaceAll("^[,\\s]+", "").replaceAll("[,\\s]+$", "");
        if (core.equals("or") || core.equals("/")) return "or";
        if (core.isEmpty()) return "comma";
        return "other";
    }

    /** Backwards-compatible single-token check used by tests. */
    static boolean hasToken(String text, String token) {
        return boundary(token).matcher(text.toLowerCase(Locale.ROOT)).find();
    }

    private record Hit(String name, int start, int end, String conn) {}

    public record MatchResult(int score, List<String> matched, List<String> gaps, List<String> overflow, int jdTotal) {}
}
