package engineer.arabski.lesson.dto;

public record LessonPreviewResponse(
        Long id,
        String title,
        String description,
        String icon,
        boolean isPublished,
        int taskCount,
        int orderIndex) {
}
