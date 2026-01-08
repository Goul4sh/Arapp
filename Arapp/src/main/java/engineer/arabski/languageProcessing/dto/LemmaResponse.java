package engineer.arabski.languageProcessing.dto;

public record LemmaResponse(

        String original,
        String lemma,
        String partOfSpeech,
        String root,
        String diacritic,
        int startIndex,
        int endIndex

) {
}
