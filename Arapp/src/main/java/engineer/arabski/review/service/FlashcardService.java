package engineer.arabski.review.service;

import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.languageProcessing.service.DictionaryWordFlashcardService;
import engineer.arabski.review.dto.FlashcardItemRequest;
import engineer.arabski.review.dto.FlashcardItemResponse;
import engineer.arabski.review.model.FlashcardGroup;
import engineer.arabski.review.model.FlashcardItem;
import engineer.arabski.review.repository.FlashcardGroupRepository;
import engineer.arabski.review.repository.FlashcardRepository;
import engineer.arabski.statistics.dto.UserStatsRequest;
import engineer.arabski.statistics.service.StatsService;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;

    private final FlashcardGroupRepository flashcardGroupRepository;

    private final DictionaryWordFlashcardService dictionaryWordService;
    private final UserService userService;
    private final Sm2Algorithm sm2Algorithm = new Sm2Algorithm();

    private final StatsService statsService;

    public static FlashcardItemResponse toResponse(FlashcardItem flashcardItem) {

        return new FlashcardItemResponse(flashcardItem.getId(),
                DictionaryWordFlashcardService.toResponseFlashcard(flashcardItem.getWord()),
                flashcardItem.getNextReviewDate()

        );
    }

    @Transactional
    public FlashcardItem createFlashcardItem(Long word_id, Long owner_id) {

        DictionaryWord dictionaryWord = dictionaryWordService.getWordEntity(word_id);
        if (dictionaryWord == null) throw new RuntimeException("Word not found");

        User user = userService.getUserById(owner_id);
        if (user == null) throw new RuntimeException("User not found");

        FlashcardItem flashcardItem = new FlashcardItem(user, dictionaryWord);
        FlashcardItem saved = flashcardRepository.save(flashcardItem);
        FlashcardGroup defaultGroup = getOrCreateDefaultGroup(user);
        if (defaultGroup != null) {
            defaultGroup.getFlashcardItems().add(saved);
            flashcardGroupRepository.save(defaultGroup);
        }
        return saved;

    }

    private FlashcardGroup getOrCreateDefaultGroup(User user) {
        return flashcardGroupRepository.findByOwner_IdAndIsDefaultTrue(user.getId())
                .orElseGet(() -> {

                    FlashcardGroup newGroup = new FlashcardGroup();
                    newGroup.setName("Ogólna");
                    newGroup.setDescription("Domyślna grupa dla wszystkich słówek");
                    newGroup.setCategory("Ogólna");
                    newGroup.setOwner(user);
                    newGroup.setDefault(true);
                    return flashcardGroupRepository.save(newGroup);
                });
    }

    public FlashcardItem updateFlashcardItem(FlashcardItemRequest request, Long id) {

        FlashcardItem flashcardItem = flashcardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlashcardItem not found with id: " + id));

        if (request.word_id() != null) {
            DictionaryWord dictionaryWord = dictionaryWordService.getWordEntity(request.word_id());
            if (dictionaryWord == null) {
                throw new RuntimeException("Word not found with id: " + request.word_id());
            }
            flashcardItem.setWord(dictionaryWord);
        }

        return flashcardRepository.save(flashcardItem);
    }


    public void deleteFlashcardItemByOwnerAndWordId(Long owner_id, Long word_id) {

        try {
            flashcardRepository.deleteByFlashcardOwner_IdAndWord_Id(owner_id, word_id);

        } catch (Exception e) {
            throw new RuntimeException("Could not delete flashcard for owner " + owner_id + " and word " + word_id + ": " + e.getMessage());
        }

    }

    public void deleteFlashcardItemById(Long id) {
        flashcardRepository.deleteById(id);
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

    public List<FlashcardItemResponse> getFlashcardItemsForReview(Long group) {
        List<FlashcardItem> flashcardItems = flashcardRepository.findDueFlashcardsInGroup(
                group,
                LocalDateTime.now()
        );
        return flashcardItems.stream().map(FlashcardService::toResponse).toList();
    }


    public List<FlashcardItemResponse> getFlashcardItemsByGroup(Long group) {
        List<FlashcardItem> flashcardItems = flashcardRepository.getAllByFlashcardGroup_Id(group);
        return flashcardItems.stream().map(FlashcardService::toResponse).toList();
    }

    public List<FlashcardItemResponse> getFlashcardItemsByOwnerId(Long id) {
        List<FlashcardItem> flashcardItems = flashcardRepository.getAllByFlashcardOwner_Id(id);
        return flashcardItems.stream().map(FlashcardService::toResponse).toList();

    }


    public Long countDueFlashcardsForUser(Long id) {
        return flashcardRepository.countDueFlashcardsByOwner_Id(id, LocalDateTime.now());
    }


    @Transactional
    public void processReview(Long flashcardId, int quality) {

        FlashcardItem flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found: " + flashcardId));

        var result = sm2Algorithm.calculate(
                quality,
                flashcard.getRepetitions(),
                flashcard.getIntervalDays(),
                flashcard.getEaseFactor()
        );

        flashcard.setRepetitions(result.repetitions());
        flashcard.setIntervalDays(result.intervalDays());
        flashcard.setEaseFactor(result.easeFactor());

        LocalDateTime nextReview = LocalDateTime.now().plusDays(result.intervalDays());
        flashcard.setNextReviewDate(nextReview);

        flashcardRepository.save(flashcard);

        statsService.saveSessionStatsAsync(
                flashcard.getFlashcardOwner().getId(),
                new UserStatsRequest(0L, 0L, 0L, 0L, 1L)
        );
    }


}
