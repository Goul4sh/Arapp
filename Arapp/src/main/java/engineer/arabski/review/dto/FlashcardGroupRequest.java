package engineer.arabski.review.dto;

import java.util.List;

public record FlashcardGroupRequest (

        String name,
        String description,
        String category,
        List<Long> flashcardItem_Ids

) {

}
