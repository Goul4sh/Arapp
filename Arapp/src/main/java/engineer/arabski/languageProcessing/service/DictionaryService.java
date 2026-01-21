package engineer.arabski.languageProcessing.service;

import engineer.arabski.languageProcessing.dto.*;
import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.languageProcessing.repository.DictionaryWordRepository;

import engineer.arabski.task.repository.TaskWordReferenceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DictionaryService {

    private final NLPService nlpService;
    private final DictionaryWordRepository dictionaryWordRepository;
    private final TaskWordReferenceRepository taskWordReferenceRepository;


    private WordBankListResponse toWordBankListResponse(DictionaryWord word) {
        return new WordBankListResponse(

                word.getId(),
                word.getLemma(),
                word.getRoot(),
                word.getDiacritic(),
                word.getTranslation(),
                word.getPartOfSpeech()
        );
    }


    public List<DictionaryWordResponse> analyzeAndEnrichText(String text) {

        List<LemmaResponse> analysisResults = nlpService.analyzeText(text);

        return analysisResults.stream()
                .map(wordResult -> {
                    Optional<DictionaryWord> dictionaryWord = dictionaryWordRepository.findByLemma(wordResult.lemma());

                    return new DictionaryWordResponse(
                            wordResult.original(),
                            wordResult.lemma(),
                            wordResult.partOfSpeech(),
                            wordResult.root(),
                            wordResult.diacritic(),
                            dictionaryWord.map(DictionaryWord::getId).orElse(null),
                            dictionaryWord.map(DictionaryWord::getTranslation).orElse(null),
                            wordResult.startIndex(),
                            wordResult.endIndex()
                    );

                })
                .toList();

    }


    @Transactional
    public DictionaryWord saveOrGetDictionaryWord(NewDictionaryWordRequest word) {
        System.out.println("Sprawdzam słowo w słowniku: " + word.lemma());

        Optional<DictionaryWord> existingWord = dictionaryWordRepository.findByLemma(word.lemma());

        if (existingWord.isPresent()) {

            System.out.println("Znaleziono istniejące słowo w słowniku: " + existingWord.get().getLemma());
            if (word.translation() != null && !word.translation().isBlank()) {
                existingWord.get().setTranslation(word.translation());
            }

            return existingWord.get();
        } else {

            System.out.println("Nie znaleziono słowa w słowniku. Dodaję nowe: " + word.lemma());

            DictionaryWord newWord = new DictionaryWord();
            newWord.setLemma(word.lemma());
            newWord.setPartOfSpeech(word.partOfSpeech());
            newWord.setRoot(word.root());
            newWord.setDiacritic(word.transliteration());
            newWord.setTranslation(word.translation());

            return dictionaryWordRepository.save(newWord);
        }
    }


    public List<WordBankListResponse> getAllDictionaryWords() {
        List<DictionaryWord> words = dictionaryWordRepository.findAll();

        return words.stream()
                .map(this::toWordBankListResponse)
                .toList();
    }

    public DictionaryWord findByIdEntity(Long id) {
        return dictionaryWordRepository.findById(id).orElse(null);
    }

    public Page<WordBankListResponse> getDictionaryWordsPageable(int page, int size, String query) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<DictionaryWord> wordPage;

        if (query != null && !query.isBlank()) {
            wordPage = dictionaryWordRepository.searchDictionaryWords(query, pageable);
        } else {
            wordPage = dictionaryWordRepository.findAll(pageable);
        }
        return wordPage.map(this::toWordBankListResponse);

    }


    @Transactional
    public void deleteDictionaryWord(Long id) {
        taskWordReferenceRepository.deleteByDictionaryWord_Id(id);
        dictionaryWordRepository.deleteById(id);
    }

    public void updateDictionaryWord(Long id, WordBankEditRequest request) {
        DictionaryWord word = dictionaryWordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dictionary word not found with id: " + id));

        word.setLemma(request.lemma());
        word.setRoot(request.root());
        word.setPartOfSpeech(request.partOfSpeech());
        word.setTranslation(request.translation());

        dictionaryWordRepository.save(word);
    }

}
