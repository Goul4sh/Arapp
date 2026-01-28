package engineer.arabski.languageProcessing.dto;

public record WordBankEditRequest(

        String lemma,
        String root,
        String diacritic,
        String translation,
        String partOfSpeech,
        String transliteration
) {
}
