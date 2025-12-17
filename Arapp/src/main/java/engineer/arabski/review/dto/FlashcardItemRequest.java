package engineer.arabski.review.dto;

public record FlashcardItemRequest (

        Long owner_id,
        Long word_id,
        Long repetition_interval
) {
}
