package engineer.arabski.languageProcessing.service;

import engineer.arabski.languageProcessing.dto.DictionaryWordResponse;
import engineer.arabski.languageProcessing.dto.LemmaResponse;
import engineer.arabski.languageProcessing.dto.WordBankListResponse;
import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.languageProcessing.repository.DictionaryWordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DictionaryService {

    private final NLPService nlpService;
    private final DictionaryWordRepository dictionaryWordRepository;



    private WordBankListResponse toWordBankListResponse(DictionaryWord word) {
        return new WordBankListResponse(
                word.getLemma(),
                word.getPartOfSpeech(),
                word.getRoot(),
                word.getDiacritic(),
                word.getId(),
                word.getTranslation()
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
    public DictionaryWord saveOrGetDictionaryWord(String lemma, String root, String pos, String translation) {
        System.out.println("Sprawdzam słowo w słowniku: " + lemma);

        Optional<DictionaryWord> existingWord = dictionaryWordRepository.findByLemma(lemma);

        if (existingWord.isPresent()) {

            System.out.println("Znaleziono istniejące słowo w słowniku: " + existingWord.get().getLemma());
            if (translation != null && !translation.isBlank()) {
                existingWord.get().setTranslation(translation);
            }

            return existingWord.get();
        } else {

            System.out.println("Nie znaleziono słowa w słowniku. Dodaję nowe: " + lemma);

            DictionaryWord newWord = new DictionaryWord();
            newWord.setLemma(lemma);
            newWord.setPartOfSpeech(pos);
            newWord.setRoot(root);
//            newWord.setDiacritic(lemmaResponse.diacritic());
            newWord.setTranslation(translation);

            return dictionaryWordRepository.save(newWord);
        }
    }


    public List<WordBankListResponse> getAllDictionaryWords() {
        List<DictionaryWord> words = dictionaryWordRepository.findAll();

        return words.stream()
                .map(this::toWordBankListResponse)
                .toList();
    }


}
