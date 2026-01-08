package engineer.arabski.task.dto.vocabulary;

import engineer.arabski.languageProcessing.dto.SaveDictionaryWordRequest;

import java.util.List;

public record LinkedVocabularyRequest(

        List<SaveDictionaryWordRequest> words
) {
}
