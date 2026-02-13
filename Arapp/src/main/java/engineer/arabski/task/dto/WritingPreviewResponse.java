package engineer.arabski.task.dto;

public record WritingPreviewResponse(
        Long taskId,
        String letterName,
        String letterForm
) {
}
