package engineer.arabski.lesson.dto;

import java.util.List;

public record CompendiumListResponse(

        Long id,
        String title,
        String subtitle,
        String description,
        Long requiredLessonId,
        List<CompendiumTagDTO> tags,
        boolean isPublished


) {
}
