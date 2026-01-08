package engineer.arabski.languageProcessing.controller;

import engineer.arabski.languageProcessing.dto.AnalyzeTextRequest;
import engineer.arabski.languageProcessing.dto.DictionaryWordResponse;
import engineer.arabski.languageProcessing.dto.SaveDictionaryWordRequest;
import engineer.arabski.languageProcessing.service.DictionaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
