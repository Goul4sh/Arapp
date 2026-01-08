package engineer.arabski.languageProcessing.dto;

public record WordBankListResponse(

        String lemma,
        String partOfSpeech,
        String root,
        String diacritic,
        Long wordId,
        String translation

) {

}
