package engineer.arabski.review.dto;

import java.time.LocalDateTime;

public record FlashcardItemResponse(

        WordResponse word,
        LocalDateTime nextReviewDate

//        Integer repetitions,
//        Integer intervalDays,
//        Double easeFactor

) {
}
