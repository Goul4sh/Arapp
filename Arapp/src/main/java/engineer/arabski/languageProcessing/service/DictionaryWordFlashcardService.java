package engineer.arabski.languageProcessing.service;

import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.languageProcessing.repository.DictionaryWordRepository;
import engineer.arabski.review.dto.WordRequest;
import engineer.arabski.review.dto.WordResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DictionaryWordFlashcardService {

    private final DictionaryWordRepository dictionaryWordRepository;


    public static WordResponse toResponseFlashcard(DictionaryWord word) {

        return new WordResponse(
                word.getLemma(),
                word.getDiacritic(),
                word.getTranslation(),
                word.getTransliteration()
        );
    }

    public static DictionaryWord toEntityFlashcard(WordRequest response) {
        DictionaryWord dictionaryWord = new DictionaryWord();
        dictionaryWord.setLemma(response.wordArabic());
        dictionaryWord.setTranslation(response.wordTranslation());
        dictionaryWord.setTransliteration(response.Transliteration());
        return dictionaryWord;
    }


    public DictionaryWord getWordEntity(Long id) {

        return dictionaryWordRepository.findById(id).orElse(null);
    }

    public List<WordResponse> getAll() {

        return dictionaryWordRepository.findAll().stream()
                .map(DictionaryWordFlashcardService::toResponseFlashcard)
                .toList();

    }


}
