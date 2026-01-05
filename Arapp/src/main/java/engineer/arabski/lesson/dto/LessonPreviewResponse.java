package engineer.arabski.lesson.dto;

public record LessonPreviewResponse(
        Long id,
        String title,
        String icon,
        String description,
        boolean isPublished,
        int taskCount) {
}
