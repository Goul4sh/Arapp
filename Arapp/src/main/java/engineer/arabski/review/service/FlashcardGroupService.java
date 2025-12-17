package engineer.arabski.review.service;

import engineer.arabski.review.dto.FlashcardGroupRequest;
import engineer.arabski.review.dto.FlashcardGroupResponse;
import engineer.arabski.review.model.FlashcardGroup;
import engineer.arabski.review.model.FlashcardItem;
import engineer.arabski.review.repository.FlashcardGroupRepository;

import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

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
                flashcardGroup.getName(),
                flashcardGroup.getDescription(),
                flashcardGroup.getCategory(),
                flashcardGroup.getFlashcardItems().stream().map(FlashcardService::toResponse).toList());
    }


    public FlashcardGroupResponse createFlashcardGroup(FlashcardGroupRequest request, Long ownerId) {


        User user = userService.getUserById(ownerId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<FlashcardItem> flashcardItems = request.flashcardItem_Ids().stream()
                .map(flashcardService::getFlashcardItemEntity)
                .toList();


        //TODO dodac mozliwosc dodawania bezpiecznie pustej grupy, a dopiero pozniej dodania do niej fiszek

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

        if (request.flashcardItem_Ids() != null) {
            List<FlashcardItem> flashcardItems = request.flashcardItem_Ids().stream()
                    .map(flashcardService::getFlashcardItemEntity)
                    .toList();

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
        return flashcardGroups.stream().map(FlashcardGroupService::toResponse).toList();
    }
}
