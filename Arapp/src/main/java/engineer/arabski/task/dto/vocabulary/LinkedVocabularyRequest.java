package engineer.arabski.task.dto.vocabulary;

import engineer.arabski.languageProcessing.dto.SaveDictionaryWordWithReferenceRequest;

import java.util.List;

public record LinkedVocabularyRequest(

        List<SaveDictionaryWordWithReferenceRequest> words
) {
}
