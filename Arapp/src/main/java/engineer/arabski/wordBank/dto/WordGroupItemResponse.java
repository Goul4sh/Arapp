package engineer.arabski.wordBank.dto;

public record WordGroupItemResponse(

        Long id,
        String wordArabic,
        String wordTranslation,
        String Transliteration,
        String diacritic
        ) {

}
