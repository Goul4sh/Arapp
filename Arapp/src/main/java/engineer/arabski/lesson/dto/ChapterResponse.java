package engineer.arabski.lesson.dto;

import java.util.List;

public record ChapterResponse(

        Long id,
        String title,
        String description,
        List<LessonPreviewResponse> lessons

) {
}
