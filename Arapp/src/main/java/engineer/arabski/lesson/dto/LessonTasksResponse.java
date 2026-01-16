package engineer.arabski.lesson.dto;

import engineer.arabski.task.dto.TaskData;
import engineer.arabski.task.dto.vocabulary.EnrichedTaskResponse;

import java.util.List;

public record LessonTasksResponse(
        List<EnrichedTaskResponse> tasks

) {

//    public record TaskDataWithId(
//            Long id,
//            EnrichedTaskResponse task
////            TaskData data
//    ) {
//    }

}
