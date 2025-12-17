package engineer.arabski.review.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.review.dto.FlashcardGroupRequest;
import engineer.arabski.review.dto.FlashcardGroupResponse;
import engineer.arabski.review.dto.FlashcardItemResponse;
import engineer.arabski.review.service.FlashcardGroupService;
import engineer.arabski.task.dto.TaskData;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/flashcard-groups")
public class FlashcardGroupController {

    private final FlashcardGroupService flashcardGroupService;

    public FlashcardGroupController(FlashcardGroupService flashcardGroupService) {
        this.flashcardGroupService = flashcardGroupService;

    }



    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        FlashcardGroupResponse group = flashcardGroupService.getFlashcardGroup(id);
        if (group != null) {

            return ResponseEntity.status(HttpStatus.OK).body(group);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

    }

    @GetMapping({"/user", "/user/{userId}"})
    public ResponseEntity<?> findByUserId(
            @PathVariable(required = false) Long userId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        Long targetUserId = (userId != null) ? userId : customUserDetails.getId();

        List<FlashcardGroupResponse> flashcards = flashcardGroupService.getAllFlashcardGroupByOwner(targetUserId);

        if (!flashcards.isEmpty()) {
            return ResponseEntity.ok(flashcards);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Flashcards not found for user");
        }
    }


    @PostMapping
    public ResponseEntity<?> createFlashcardGroup(@RequestBody FlashcardGroupRequest data, @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        FlashcardGroupResponse createdTask = flashcardGroupService.createFlashcardGroup(data, customUserDetails.getId());
        if (createdTask != null) {

            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task");

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFlashcardGroup(@PathVariable Long id) {

        try {
            flashcardGroupService.deleteFlashcardGroup(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not delete flashcard group");
        }

    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateFlashcardGroup(@PathVariable Long id ,@RequestBody FlashcardGroupRequest data) {
        FlashcardGroupResponse updatedTask = flashcardGroupService.updateFlashcardGroup(data, id);
        if (updatedTask != null) {

            return ResponseEntity.status(HttpStatus.OK).body(updatedTask);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not update flashcard group");
    }


}
