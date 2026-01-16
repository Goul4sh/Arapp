package engineer.arabski.task.dto.vocabulary;

public record WordReferenceResponse(

        Long dictionaryWordId,
        String lemma,
        String dictionaryTranslation,
        String contextualTranslation,
        int startIndex,
        int endIndex,
        boolean hasFlashcard

) {
}
