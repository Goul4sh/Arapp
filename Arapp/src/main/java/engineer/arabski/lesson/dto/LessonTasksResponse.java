package engineer.arabski.lesson.dto;

import engineer.arabski.task.dto.vocabulary.EnrichedTaskResponse;

import java.util.List;

public record LessonTasksResponse(
        List<EnrichedTaskResponse> tasks

) { }
