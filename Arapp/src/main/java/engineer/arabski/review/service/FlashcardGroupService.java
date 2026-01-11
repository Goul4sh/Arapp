package engineer.arabski.review.service;

import engineer.arabski.review.dto.FlashcardGroupRequest;
import engineer.arabski.review.dto.FlashcardGroupResponse;
import engineer.arabski.review.exception.FlashcardNotFoundException;
import engineer.arabski.review.model.FlashcardGroup;
import engineer.arabski.review.model.FlashcardItem;
import engineer.arabski.review.repository.FlashcardGroupRepository;

import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

//TODO wypelnic funkcje walidacją i logiką biznesową
@Service
public class FlashcardGroupService {


    private final FlashcardGroupRepository flashcardGroupRepository;

    private final FlashcardService flashcardService;

    private final UserService userService;

    public FlashcardGroupService(FlashcardGroupRepository flashcardGroupRepository, FlashcardService flashcardService, UserService userService) {
        this.flashcardGroupRepository = flashcardGroupRepository;
        this.flashcardService = flashcardService;
        this.userService = userService;
    }


    public static FlashcardGroupResponse toResponse(FlashcardGroup flashcardGroup) {


        return new FlashcardGroupResponse(
                flashcardGroup.getId(),
                flashcardGroup.getName(),
                flashcardGroup.getDescription(),
                flashcardGroup.getCategory(),
                flashcardGroup.getFlashcardItems().stream().map(FlashcardService::toResponse).toList(),
                flashcardGroup.isDefault());
    }


    public FlashcardGroupResponse createFlashcardGroup(FlashcardGroupRequest request, Long ownerId) {


        User user = userService.getUserById(ownerId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Set<Long> uniqueIds = new HashSet<>(request.flashcardItem_Ids());

        List<FlashcardItem> flashcardItems = uniqueIds.stream()
                .map(flashcardService::getFlashcardItemEntity)
                .toList();

        if (flashcardItems.contains(null)) {
            throw new FlashcardNotFoundException("One or more flashcard items do not exist");
        }

        FlashcardGroup flashcardGroup = new FlashcardGroup(
                request.name(),
                request.description(),
                request.category(),
                user,
                flashcardItems
        );

        return toResponse(flashcardGroupRepository.save(flashcardGroup));
    }


    public FlashcardGroup createFlashcardGroup(FlashcardGroup flashcardGroup) {

        return flashcardGroupRepository.save(flashcardGroup);
    }

    public FlashcardGroupResponse updateFlashcardGroup(FlashcardGroupRequest request, Long id) {

        FlashcardGroup flashcardGroup = flashcardGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlashcardGroup not found with id: " + id));


        flashcardGroup.setName(request.name());
        flashcardGroup.setDescription(request.description());
        flashcardGroup.setCategory(request.category());

        // Jeżeli podano nowe flashcardItem_Ids, to aktualizuj powiązania
        if (request.flashcardItem_Ids() != null) {

            Set<Long> uniqueIds = new HashSet<>(request.flashcardItem_Ids());


            List<FlashcardItem> flashcardItems = uniqueIds.stream()
                    .map(flashcardService::getFlashcardItemEntity)
                    .toList();

            if (flashcardItems.contains(null)) {
                throw new FlashcardNotFoundException("One or more flashcard items do not exist");
            }

            flashcardGroup.getFlashcardItems().clear();
            flashcardGroup.getFlashcardItems().addAll(flashcardItems);
        }


        return toResponse(flashcardGroupRepository.save(flashcardGroup));
    }

    public void deleteFlashcardGroup(FlashcardGroup flashcardGroup) {
        flashcardGroupRepository.delete(flashcardGroup);
    }

    public void deleteFlashcardGroup(Long id) {

        FlashcardGroup flashcardGroup = flashcardGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlashcardGroup not found"));

        flashcardGroup.getFlashcardItems().clear();

        flashcardGroupRepository.delete(flashcardGroup);
    }


    public FlashcardGroupResponse getFlashcardGroup(Long id) {


        FlashcardGroup flashcardGroup = flashcardGroupRepository.findById(id).orElse(null);
        if (flashcardGroup == null) {
            return null;
        }

        return toResponse(flashcardGroup);
    }

    public FlashcardGroup getFlashcardGroupByOwner(Long ownerId) {
        return flashcardGroupRepository.findByOwner_Id(ownerId).orElse(null);

    }

    public List<FlashcardGroupResponse> getAllFlashcardGroupByOwner(Long ownerId) {

        if (!userService.existsById(ownerId)) {
            throw new RuntimeException("User not found with id: " + ownerId);
        }

        List<FlashcardGroup> flashcardGroups = flashcardGroupRepository.findAllByOwner_Id(ownerId);
        if (flashcardGroups.isEmpty()) {
            return List.of();
        }
        return flashcardGroups.stream().map(FlashcardGroupService::toResponse).toList();
    }


    @Transactional
    public FlashcardGroupResponse addFlashcardItemsToGroup(Long groupId, List<Long> itemIds) {
        FlashcardGroup flashcardGroup = flashcardGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("FlashcardGroup not found with id: " + groupId));

        List<FlashcardItem> flashcardItems = itemIds.stream()
                .map(flashcardService::getFlashcardItemEntity)
                .toList();

        if (flashcardItems.contains(null)) {
            throw new FlashcardNotFoundException("One or more flashcard items do not exist");
        }

        for (FlashcardItem item : flashcardItems) {
            if (!flashcardGroup.getFlashcardItems().contains(item)) {
                flashcardGroup.getFlashcardItems().add(item);
            }
        }

        return toResponse(flashcardGroupRepository.save(flashcardGroup));

    }

    @Transactional
    public FlashcardGroupResponse removeFlashcardItemsFromGroup(Long groupId, List<Long> itemIds) {
        FlashcardGroup flashcardGroup = flashcardGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("FlashcardGroup not found with id: " + groupId));

        List<FlashcardItem> flashcardItems = itemIds.stream()
                .map(flashcardService::getFlashcardItemEntity)
                .toList();

        if (flashcardItems.contains(null)) {
            throw new FlashcardNotFoundException("One or more flashcard items do not exist");
        }

        flashcardGroup.getFlashcardItems().removeAll(flashcardItems);
        return toResponse(flashcardGroupRepository.save(flashcardGroup));
    }


}
