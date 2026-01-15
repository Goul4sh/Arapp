package engineer.arabski.languageProcessing.dto;

public record NewDictionaryWordRequest(
        String lemma,
        String transliteration,
        String root,
        String partOfSpeech,
        String translation
        ) {
}
