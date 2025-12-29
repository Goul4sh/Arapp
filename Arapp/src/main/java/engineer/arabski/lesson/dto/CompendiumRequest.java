package engineer.arabski.lesson.dto;

import java.util.List;

public record CompendiumRequest(
        String content,
        String title,
        String subtitle,
        String description,
        Long requiredLessonId,
        List<String> tagNames

) {
}
