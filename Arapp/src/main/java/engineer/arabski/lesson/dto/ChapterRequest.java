package engineer.arabski.lesson.dto;

import java.util.List;

public record ChapterRequest(

        String title,
        String description,
        List<Long> lessonIds,
        int orderIndex

) {
}
