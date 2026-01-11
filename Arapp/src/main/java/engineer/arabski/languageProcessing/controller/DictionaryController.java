package engineer.arabski.languageProcessing.controller;

import engineer.arabski.languageProcessing.dto.*;
import engineer.arabski.languageProcessing.service.DictionaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dictionary")
@RequiredArgsConstructor
public class DictionaryController {


    private final DictionaryService dictionaryService;


    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeText(@RequestBody AnalyzeTextRequest request) {

        System.out.println("to dostałem do analizy: " + request);

        List<DictionaryWordResponse> analyzedWords = dictionaryService.analyzeAndEnrichText(request.text());
        return ResponseEntity.status(HttpStatus.OK).body(analyzedWords);
    }


    @PostMapping("/add-words")
    public ResponseEntity<?> addWordsToDictionary(@RequestBody List<SaveDictionaryWordRequest> words) {
        for (SaveDictionaryWordRequest word : words) {
            dictionaryService.saveOrGetDictionaryWord(
                    word.lemma(),
                    word.root(),
                    word.partOfSpeech(),
                    word.translation()
            );
        }

        return ResponseEntity.status(HttpStatus.OK).body("Words added/updated successfully.");
    }

    @GetMapping
    public ResponseEntity<?> getDictionaryWordsPageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String query
    ) {
        Page<WordBankListResponse> words = dictionaryService.getDictionaryWordsPageable(page, size, query);
        return ResponseEntity.status(HttpStatus.OK).body(words);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDictionaryWord(@PathVariable Long id) {
        dictionaryService.deleteDictionaryWord(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Dictionary word deleted successfully.");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateDictionaryWord(@PathVariable Long id, @RequestBody WordBankEditRequest request) {
        dictionaryService.updateDictionaryWord(id, request);
        return ResponseEntity.status(HttpStatus.OK).body("Dictionary word updated successfully.");
    }

}
