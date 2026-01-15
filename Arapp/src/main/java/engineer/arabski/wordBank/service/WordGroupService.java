package engineer.arabski.wordBank.service;

import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.languageProcessing.repository.DictionaryWordRepository;
import engineer.arabski.review.repository.FlashcardRepository;
import engineer.arabski.review.service.FlashcardService;
import engineer.arabski.wordBank.dto.WordGroupDetailResponse;
import engineer.arabski.wordBank.dto.WordGroupItemResponse;
import engineer.arabski.wordBank.dto.WordGroupRequest;
import engineer.arabski.wordBank.dto.WordGroupPreviewResponse;
import engineer.arabski.wordBank.model.WordGroup;
import engineer.arabski.wordBank.repository.WordGroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class WordGroupService {

    private final WordGroupRepository wordGroupRepository;

    private final FlashcardRepository flashcardRepository;

    private final DictionaryWordRepository dictionaryWordRepository;

    public void deleteWordGroup(Long groupId) {
        wordGroupRepository.deleteById(groupId);
    }


    public WordGroupPreviewResponse toResponsePreview(WordGroup wordGroup) {

        return new WordGroupPreviewResponse(
                wordGroup.getId(),
                wordGroup.getName(),
                wordGroup.getDescription(),
                wordGroup.getIcon(),
                wordGroup.getImageUrl(),
                "placeholder!",
                wordGroup.getWords().size(),
                wordGroup.isPublished()
        );

    }

    public WordGroupDetailResponse toResponseDetail(WordGroup wordGroup) {

        List<WordGroupItemResponse> wordGroupItemResponseList = wordGroup.getWords()
                .stream().map(this::dictionaryWordToWordGroupItemResponse).toList();

        return new WordGroupDetailResponse(
                wordGroup.getId(),
                wordGroupItemResponseList

        );
    }

    public WordGroupItemResponse dictionaryWordToWordGroupItemResponse(DictionaryWord word) {
        return new WordGroupItemResponse(
                word.getId(),
                word.getLemma(),
                word.getTranslation(),
                word.getTransliteration(),
                word.getDiacritic(),
                false
        );
    }

    public List<WordGroupPreviewResponse> findAll() {

        List<WordGroup> wordGroups = wordGroupRepository.findAll();

        return wordGroups.stream()
                .map(this::toResponsePreview)
                .toList();
    }

    public List<WordGroupPreviewResponse> findAllPublished() {

        List<WordGroup> wordGroups = wordGroupRepository.findAll();

        return wordGroups.stream().filter(WordGroup::isPublished)
                .map(this::toResponsePreview)
                .toList();
    }

    // Wykorzystuje detailed response.
    public WordGroupDetailResponse findById(Long groupId) {

        WordGroup wordGroup = wordGroupRepository.findById(groupId).orElse(null);

        if (wordGroup != null) {
            return toResponseDetail(wordGroup);
        } else {
            return null;
        }

    }

    public WordGroupDetailResponse findByIdWithFlashcardInfo(Long groupId, Long userId) {

        Set<DictionaryWord> wordsInGroup = wordGroupRepository.findById(groupId)
                .map(WordGroup::getWords)
                .orElse(new HashSet<>());

        List<Long> wordIds = wordsInGroup.stream().map(DictionaryWord::getId).toList();
        Set<Long> userFlashcardWordIds = flashcardRepository.findAllByWord_IdsAndFlashcardOwner_Id(wordIds, userId);

        return new WordGroupDetailResponse(

                groupId,
                wordsInGroup.stream().map(word ->
                        new WordGroupItemResponse(
                                word.getId(),
                                word.getLemma(),
                                word.getTranslation(),
                                word.getTransliteration(),
                                word.getDiacritic(),
                                userFlashcardWordIds.contains(word.getId())
                        )).toList()

        );

    }

    public WordGroupPreviewResponse save(WordGroupRequest wordGroup) {


        if (wordGroup.name() == null || wordGroup.name().isBlank()) {
            throw new IllegalArgumentException("Word group name cannot be null or empty");
        }

        WordGroup newGroup = new WordGroup();
        newGroup.setName(wordGroup.name());
        newGroup.setDescription(wordGroup.description());
        newGroup.setIcon(wordGroup.icon());
        newGroup.setImageUrl(wordGroup.imageUrl());


        WordGroup savedGroup = wordGroupRepository.save(newGroup);

        return toResponsePreview(savedGroup);
    }

    public WordGroupPreviewResponse update(Long groupId, WordGroupRequest updatedGroupData) {

        Optional<WordGroup> existingGroupOpt = wordGroupRepository.findById(groupId);

        if (existingGroupOpt.isPresent()) {
            WordGroup existingGroup = existingGroupOpt.get();

            if (updatedGroupData.name() != null) {
                existingGroup.setName(updatedGroupData.name());
            }
            if (updatedGroupData.description() != null) {
                existingGroup.setDescription(updatedGroupData.description());
            }
            if (updatedGroupData.icon() != null) {
                existingGroup.setIcon(updatedGroupData.icon());
            }
            if (updatedGroupData.imageUrl() != null) {
                existingGroup.setImageUrl(updatedGroupData.imageUrl());
            }

            WordGroup savedGroup = wordGroupRepository.save(existingGroup);

            return toResponsePreview(savedGroup);
        } else {
            throw new IllegalArgumentException("Word group not found with id " + groupId);
        }

    }

    @Transactional
    public WordGroupPreviewResponse removeOrAddWordsToGroup(Long groupId, List<Long> wordIds, boolean removeMode) {
        WordGroup existingGroup = wordGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Word group not found with id " + groupId));


        List<DictionaryWord> wordsToAdd = dictionaryWordRepository.findByIdIn(wordIds);

        if (removeMode) {

            wordsToAdd.forEach(existingGroup.getWords()::remove);

            WordGroup newGroup = wordGroupRepository.save(existingGroup);

            System.out.println("Liczba słów w grupie po usunięciu: " + newGroup.getWords().size());

            return toResponsePreview(newGroup);
        } else {

            existingGroup.getWords().addAll(wordsToAdd);

            WordGroup newGroup = wordGroupRepository.save(existingGroup);

            System.out.println("Liczba słów w grupie po dodaniu: " + newGroup.getWords().size());

            return toResponsePreview(newGroup);

        }


    }


    public void publishWordGroup(Long groupId, boolean published) {
        WordGroup wordGroup = wordGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Word group not found with id " + groupId));

        wordGroup.setPublished(published);

        wordGroupRepository.save(wordGroup);
    }


}
