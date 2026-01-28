package engineer.arabski.languageProcessing.dto;

public record WordBankListResponse(

        Long wordId,
        String lemma,
        String root,
        String diacritic,
        String translation,
        String partOfSpeech,
        String transliteration

) {

}
