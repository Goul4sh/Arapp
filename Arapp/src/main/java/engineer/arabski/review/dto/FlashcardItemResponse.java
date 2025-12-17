package engineer.arabski.review.dto;

public record FlashcardItemResponse (

        WordResponse word,
        Long repetitionInterval

) {
}
