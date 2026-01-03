package engineer.arabski.review.service;

import engineer.arabski.review.dto.WordRequest;
import engineer.arabski.review.dto.WordResponse;
import engineer.arabski.review.model.TemporaryWord;
import engineer.arabski.review.repository.TemporaryWordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemporaryWordService {


    private final TemporaryWordRepository temporaryWordRepository;

    public TemporaryWordService(TemporaryWordRepository temporaryWordRepository) {
        this.temporaryWordRepository = temporaryWordRepository;
    }


    public static WordResponse toResponse(TemporaryWord temporaryWord) {
        return new WordResponse(

                temporaryWord.getWordArabic(),
                temporaryWord.getWordArabicWithHarakat(),
                temporaryWord.getWordTranslation(),
                temporaryWord.getTransliteration()

        );
    }

    public static TemporaryWord toEntity(WordRequest response) {
        TemporaryWord temporaryWord = new TemporaryWord();

        temporaryWord.setWordArabic(response.wordArabic());
        temporaryWord.setWordTranslation(response.wordTranslation());
        temporaryWord.setTransliteration(response.Transliteration());

        return temporaryWord;
    }



    public TemporaryWord getTemporaryWordEntity(Long id) {

        return temporaryWordRepository.findById(id).orElse(null);
    }

    public WordResponse getTemporaryWord(Long id) {

        TemporaryWord word = temporaryWordRepository.findById(id).orElse(null);

        if (word == null) {
            return null;
        }


        return toResponse(word);
    }

    public List<WordResponse> getAll() {

        return  temporaryWordRepository.findAll().stream()
                .map(TemporaryWordService::toResponse)
                .toList();

    }

    public TemporaryWord createTemporaryWord(TemporaryWord temporaryWord) {
        return temporaryWordRepository.save(temporaryWord);
    }

    public WordResponse createTemporaryWordAndReturnResponse(TemporaryWord temporaryWord) {
        TemporaryWord savedWord = temporaryWordRepository.save(temporaryWord);
        return toResponse(savedWord);
    }


    public WordResponse createTemporaryWordAndReturnResponse(WordRequest temporaryWord) {

        TemporaryWord savedWord = temporaryWordRepository.save(toEntity(temporaryWord));
        return toResponse(savedWord);
    }


}
