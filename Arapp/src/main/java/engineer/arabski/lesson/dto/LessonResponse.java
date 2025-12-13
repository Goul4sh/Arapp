package engineer.arabski.lesson.dto;

import engineer.arabski.task.dto.TaskData;

import java.util.List;

public record LessonResponse(List<TaskData> tasks) {
}
