package engineer.arabski.lesson.dto;

import engineer.arabski.task.dto.TaskData;

import java.util.List;

public record LessonTasksResponse(List<TaskDataWithId> tasks) {

    public record TaskDataWithId(
            Long id,
            TaskData data
    ) {
    }

}
