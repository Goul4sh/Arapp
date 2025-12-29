package engineer.arabski.lesson.service;

import engineer.arabski.lesson.dto.CompendiumDetailResponse;
import engineer.arabski.lesson.dto.CompendiumListResponse;
import engineer.arabski.lesson.dto.CompendiumRequest;
import engineer.arabski.lesson.dto.CompendiumTagDTO;
import engineer.arabski.lesson.model.CompendiumEntry;
import engineer.arabski.lesson.model.CompendiumTag;
import engineer.arabski.lesson.repository.CompendiumRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CompendiumService {


    private final CompendiumRepository compendiumRepository;

    private final CompendiumTagService compendiumTagService;

    public CompendiumService(CompendiumRepository compendiumRepository, CompendiumTagService compendiumTagService) {
        this.compendiumRepository = compendiumRepository;
        this.compendiumTagService = compendiumTagService;
    }

    public CompendiumTagDTO tagToResponse(CompendiumTag tag) {
        return new CompendiumTagDTO(
                tag.getName(),
                tag.getDisplayName()
        );
    }



    public CompendiumListResponse itemToSummary(CompendiumEntry entry) {
        return new  CompendiumListResponse (
                entry.getId(),
                entry.getTitle(),
                entry.getIcon(),
                entry.getDescription(),
                entry.getRequiredLessonId(),
                entry.getTags().stream().map(this::tagToResponse).toList()
        );

    }

    public CompendiumDetailResponse itemToDetail(CompendiumEntry entry) {
        return new CompendiumDetailResponse(
                entry.getContent()
        );

    }

    public CompendiumEntry toEntity(CompendiumRequest request) {

        CompendiumEntry compendiumEntry = new CompendiumEntry();
        compendiumEntry.setTitle(request.title());
        compendiumEntry.setIcon(request.subtitle()); // Uwaga! Ten atrybut moze zostac zmieniony w przyszlosci
        compendiumEntry.setDescription(request.description());
        compendiumEntry.setContent(request.content());
        compendiumEntry.setRequiredLessonId(request.requiredLessonId());

        // tagi obslugiwane sa poza ta funkjca

        return compendiumEntry;
    }

    public void addCompendiumItem(CompendiumEntry compendiumEntry) {
        compendiumRepository.save(compendiumEntry);
    }


    @Transactional
    public void addCompendiumItem(CompendiumRequest request) {

        System.out.println(request.tagNames());

        Set<String> tagNamesSet = new HashSet<>(request.tagNames());

        Set<CompendiumTag> tags = compendiumTagService.getAllByName(tagNamesSet);

        if (tags.size() != request.tagNames().size()) {
            System.out.println("Requested tags: " + request.tagNames());
            throw new IllegalArgumentException("One or more Tag Names are invalid");
        }


        //To można później zoptymalizować

        CompendiumEntry compendiumEntry = toEntity(request);

        compendiumEntry = compendiumRepository.save(compendiumEntry);

        compendiumEntry.setTags(tags);
        compendiumRepository.save(compendiumEntry);
    }

    public CompendiumDetailResponse getCompendiumDetailById(Long id) {
        CompendiumEntry entry = compendiumRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Compendium item not found with id " + id));
        return itemToDetail(entry);
    }

    public List<CompendiumListResponse> getAllCompendiumListItems() {
        return compendiumRepository.findAll().stream()
                .map(this::itemToSummary)
                .toList();
    }


}
