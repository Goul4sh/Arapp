package engineer.arabski.task.dto.vocabulary;

import engineer.arabski.task.dto.TaskData;

public record EnrichedTaskRequest(

    TaskData taskData,
    LinkedVocabularyRequest linkedVocabulary
) {
}
