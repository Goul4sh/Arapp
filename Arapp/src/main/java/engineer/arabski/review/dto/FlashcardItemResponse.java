package engineer.arabski.review.dto;

import java.time.LocalDateTime;

public record FlashcardItemResponse(

        Long id,
        WordResponse word,
        LocalDateTime nextReviewDate

//        Integer repetitions,
//        Integer intervalDays,
//        Double easeFactor

) {
}
