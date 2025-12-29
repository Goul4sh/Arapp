package engineer.arabski.lesson.dto;

import java.util.List;

public record LessonRequest(
        String title,
        String description,
        String icon,
        List<Long> taskIds
        ) {
}
