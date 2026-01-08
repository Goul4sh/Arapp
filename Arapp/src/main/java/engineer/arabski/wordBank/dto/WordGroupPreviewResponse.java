package engineer.arabski.wordBank.dto;

public record WordGroupPreviewResponse(

        Long id,
        String name,
        String description,
        String icon,
        String imageUrl,
        String category,
        Long wordsCount

) {
}
