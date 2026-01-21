package engineer.arabski.task.dto.vocabulary;

import engineer.arabski.task.dto.TaskData;

import java.util.List;

public record EnrichedTaskResponse(

        Long taskId,
        TaskData data,
        List<WordReferenceResponse> references

) {
}
