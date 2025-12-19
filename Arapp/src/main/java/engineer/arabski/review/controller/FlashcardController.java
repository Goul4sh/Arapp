package engineer.arabski.review.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.review.dto.FlashcardItemRequest;
import engineer.arabski.review.dto.FlashcardItemResponse;
import engineer.arabski.review.model.FlashcardItem;
import engineer.arabski.review.service.FlashcardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    //TODO trzeba dodać obliczanie nastepnej powtorki flashcarda

    private final FlashcardService flashcardService;


    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }



    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        FlashcardItemResponse flashcardItem = flashcardService.getFlashcardItem(id);
        if (flashcardItem != null) {

            return ResponseEntity.status(HttpStatus.OK).body(flashcardItem);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Flashcard not found");

    }
//
    @GetMapping("/group/{group_id}")
    public ResponseEntity<?> findDueByGroupId(@PathVariable Long group_id) {

      List <FlashcardItemResponse> flashcardItems = flashcardService.getFlashcardItemsForReview(group_id);
        if (!flashcardItems.isEmpty()) {

            return ResponseEntity.status(HttpStatus.OK).body(flashcardItems);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("No flashcards found for group");
        }
    }



    @GetMapping({"/user", "/user/{userId}"})
    public ResponseEntity<?> findByUserId(
            @PathVariable (required = false) Long userId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        Long targetUserId = (userId != null) ? userId : customUserDetails.getId();

        List<FlashcardItemResponse> flashcards = flashcardService.getFlashcardItemsByOwnerId(targetUserId);

        if (flashcards != null) {
            return ResponseEntity.status(HttpStatus.OK).body(flashcards);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Flashcards not found for user");
        }

    }


    @PostMapping
    public ResponseEntity<?> createFlashcard(@RequestBody Long word_id, @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        FlashcardItem createdFlashcard = flashcardService.createFlashcardItem(word_id, customUserDetails.getId());
        if (createdFlashcard != null) {

            return ResponseEntity.status(HttpStatus.CREATED).body(FlashcardService.toResponse(createdFlashcard));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create flashcard");

    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateFlashcard(@PathVariable Long id, @RequestBody FlashcardItemRequest request) {

        FlashcardItem updatedFlashcard = flashcardService.updateFlashcardItem(request, id);
        if (updatedFlashcard != null) {

            return ResponseEntity.status(HttpStatus.OK).body(FlashcardService.toResponse(updatedFlashcard));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not update flashcard");

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFlashcard(@PathVariable Long id) {
        try {
            flashcardService.deleteFlashcardItemById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not delete flashcard");
        }

    }

    @PostMapping("/review/{id}")
    public ResponseEntity<?> reviewFlashcard(@PathVariable Long id, @RequestParam("quality") int quality) {
        try {

            if (quality < 0 || quality > 5) {
                return ResponseEntity.badRequest().build();
            }

            flashcardService.processReview(id, quality);

            return ResponseEntity.status(HttpStatus.OK).body("Flashcard reviewed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not review flashcard: " + e.getMessage());
        }
    }

}
