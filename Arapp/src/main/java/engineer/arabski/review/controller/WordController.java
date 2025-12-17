package engineer.arabski.review.controller;

import engineer.arabski.review.dto.FlashcardGroupResponse;
import engineer.arabski.review.dto.WordRequest;
import engineer.arabski.review.dto.WordResponse;
import engineer.arabski.review.model.TemporaryWord;
import engineer.arabski.review.service.TemporaryWordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/words")
public class WordController {


    private final TemporaryWordService temporaryWordService;


    public WordController(TemporaryWordService temporaryWordService) {
        this.temporaryWordService = temporaryWordService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        WordResponse word = temporaryWordService.getTemporaryWord(id);
        if (word != null) {

            return ResponseEntity.status(HttpStatus.OK).body(word);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Word not found");

    }

    @GetMapping
    public ResponseEntity<?> findAll() {
        List<WordResponse> words = temporaryWordService.getAll();
        if (words != null) {

            return ResponseEntity.status(HttpStatus.OK).body(words);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Words not found");
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody WordRequest wordRequest) {
        WordResponse createdWord = temporaryWordService.createTemporaryWordAndReturnResponse(wordRequest);
        if (createdWord != null) {

            return ResponseEntity.status(HttpStatus.CREATED).body(createdWord);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create word");
    }



}
