package engineer.arabski.review.service;

import engineer.arabski.review.dto.FlashcardItemRequest;
import engineer.arabski.review.dto.FlashcardItemResponse;
import engineer.arabski.review.model.FlashcardItem;
import engineer.arabski.review.model.TemporaryWord;
import engineer.arabski.review.repository.FlashcardRepository;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;

    private final TemporaryWordService temporaryWordService;
    private final UserService userService;

    public FlashcardService(FlashcardRepository flashcardRepository, TemporaryWordService temporaryWordService, UserService userService) {
        this.flashcardRepository = flashcardRepository;
        this.temporaryWordService = temporaryWordService;
        this.userService = userService;
    }


    public static FlashcardItemResponse toResponse(FlashcardItem flashcardItem) {
        return new FlashcardItemResponse(
                TemporaryWordService.toResponse(flashcardItem.getWord()),
                flashcardItem.getRepetitionInterval()

        );
    }


    public FlashcardItem createFlashcardItem(Long word_id, Long owner_id) {

        TemporaryWord temporaryWord = temporaryWordService.getTemporaryWordEntity(word_id);

        if (temporaryWord == null) throw new RuntimeException("Word not found");

        User user = userService.getUserById(owner_id);
        if (user == null) throw new RuntimeException("User not found");

        FlashcardItem flashcardItem = new FlashcardItem(user, temporaryWord);

        return flashcardRepository.save(flashcardItem);
    }

    public FlashcardItem createFlashcardItem(FlashcardItem flashcardItem) {
        return flashcardRepository.save(flashcardItem);
    }

    public FlashcardItem updateFlashcardItem(FlashcardItemRequest request, Long id) {

        FlashcardItem flashcardItem = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlashcardItem not found with id: " + id));

        if (request.word_id() != null) {
            TemporaryWord temporaryWord = temporaryWordService.getTemporaryWordEntity(request.word_id());
            if (temporaryWord == null) {
                throw new RuntimeException("Word not found with id: " + request.word_id());
            }
            flashcardItem.setWord(temporaryWord);
        }

        if (request.repetition_interval() != null) {
            flashcardItem.setRepetitionInterval(request.repetition_interval());
        }

        return flashcardRepository.save(flashcardItem);
    }


    public void deleteFlashcardItem(FlashcardItem flashcardItem) {
        flashcardRepository.delete(flashcardItem);
    }


    public void deleteFlashcardItemById(Long id) {
        flashcardRepository.deleteById(id);
    }

    public void removeFlashcardItemFromOwner(Long ownerId, Long flashcardItemId) {
    }


    public FlashcardItem getFlashcardItemEntity(Long id) {

        return (flashcardRepository.findById(id).orElse(null));

    }


    public FlashcardItemResponse getFlashcardItem(Long id) {


        FlashcardItem flashcardItem = flashcardRepository.findById(id).orElse(null);
        if (flashcardItem != null) {

            return toResponse(flashcardItem);
        }

        return null;

    }

    public List<FlashcardItemResponse> getFlashcardItemsByOwnerId(Long id) {
        List<FlashcardItem> flashcardItems = flashcardRepository.getAllByFlashcardOwner_Id(id);
        return flashcardItems.stream().map(FlashcardService::toResponse).toList();


    }

}
