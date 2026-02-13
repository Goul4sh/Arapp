package engineer.arabski.languageProcessing.dto;

public record SaveDictionaryWordWithReferenceRequest(

        String lemma,
        String root,
        String partOfSpeech,
        String translation,
        int startIndex,
        int endIndex
) {
}
