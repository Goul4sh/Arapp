package engineer.arabski.languageProcessing.dto;

public record SaveDictionaryWordRequest(

        String lemma,
        String root,
        String partOfSpeech,
//        String diacritic,
        String translation,
        int startIndex,
        int endIndex
) {
}
