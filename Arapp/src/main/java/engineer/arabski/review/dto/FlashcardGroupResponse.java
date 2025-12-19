package engineer.arabski.review.dto;

import java.util.List;

public record FlashcardGroupResponse (
        Long id,
        String name,
        String description,
        String category,
        List<FlashcardItemResponse> flashcardItems

) {
}
