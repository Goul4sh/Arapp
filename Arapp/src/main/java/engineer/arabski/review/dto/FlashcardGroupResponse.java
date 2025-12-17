package engineer.arabski.review.dto;

import java.util.List;

public record FlashcardGroupResponse (
        String name,
        String description,
        String category,
        List<FlashcardItemResponse> flashcardItems

) {
}
