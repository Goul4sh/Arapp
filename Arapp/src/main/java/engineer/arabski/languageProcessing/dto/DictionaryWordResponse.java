package engineer.arabski.languageProcessing.dto;

public record DictionaryWordResponse(

        String original,
        String lemma,
        String partOfSpeech,
        String root,
        String diacritic,
        Long wordId,
        String translation,
        int startIndex,
        int endIndex) {
}
