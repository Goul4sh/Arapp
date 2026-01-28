package engineer.arabski.lesson.service;

import engineer.arabski.lesson.dto.CompendiumTagDTO;
import engineer.arabski.lesson.model.CompendiumTag;
import engineer.arabski.lesson.repository.CompendiumTagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class CompendiumTagService {


    private final CompendiumTagRepository compendiumTagRepository;


    public CompendiumTagService(CompendiumTagRepository compendiumTagRepository) {
        this.compendiumTagRepository = compendiumTagRepository;
    }


    public CompendiumTag tagToEntity(CompendiumTagDTO tagResponse) {
        CompendiumTag tag = new CompendiumTag();
        tag.setName(tagResponse.name());
        tag.setDisplayName(tagResponse.displayName());
        return tag;
    }


    public CompendiumTag getByName(String name) {
        return compendiumTagRepository.getByName(name)
                .orElseThrow(() -> new IllegalArgumentException("CompendiumTag not found with name " + name));
    }


    public List<CompendiumTagDTO> getAll() {
        List<CompendiumTag> tags = compendiumTagRepository.findAll();
        return tags.stream()
                .map(tag -> new CompendiumTagDTO(tag.getName(), tag.getDisplayName()))
                .toList();
    }

    public Set<CompendiumTag> getAllByName(Set<String> names)
    {
      return compendiumTagRepository.findAllByNameIn(names);

    }

    public void addTags(List<CompendiumTag> tags) {
        compendiumTagRepository.saveAll(tags);
    }

    public void addTag (CompendiumTagDTO request) {
        CompendiumTag tag = tagToEntity(request);
        compendiumTagRepository.save(tag);

    }

    public void createDefaultTagsIfNotExist() {
        String[][] defaultTags = {
                {"grammar", "Gramatyka"},
                {"vocabulary", "Słownictwo"},
                {"phrases", "Frazy"},
                {"culture", "Kultura"},
                {"idioms", "Idiomy"}
        };

        for (String[] tagData : defaultTags) {
            String name = tagData[0];
            String displayName = tagData[1];

            boolean exists = compendiumTagRepository.existsByName(name);
            if (!exists) {
                CompendiumTag tag = new CompendiumTag();
                tag.setName(name);
                tag.setDisplayName(displayName);
                compendiumTagRepository.save(tag);
            }
        }
    }


}
