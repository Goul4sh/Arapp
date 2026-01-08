package engineer.arabski.wordBank.controller;

import engineer.arabski.wordBank.dto.WordGroupDetailResponse;
import engineer.arabski.wordBank.dto.WordGroupRequest;
import engineer.arabski.wordBank.dto.WordGroupPreviewResponse;
import engineer.arabski.wordBank.service.WordGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/word-group")
@RequiredArgsConstructor
public class WordGroupController {

    private final WordGroupService wordGroupService;


    @GetMapping
    public ResponseEntity<?> findAll() {

        List<WordGroupPreviewResponse> wordGroups = wordGroupService.findAll();

        return ResponseEntity.status(HttpStatus.OK).body(wordGroups);

    }


    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        WordGroupDetailResponse wordGroup = wordGroupService.findById(id);
        if (wordGroup != null) {

            return ResponseEntity.status(HttpStatus.OK).body(wordGroup);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Word group not found");
        }
    }

    @PostMapping
    public ResponseEntity<?> createWordGroup(@RequestBody WordGroupRequest wordGroupRequest) {
        WordGroupPreviewResponse savedWordGroup = wordGroupService.save(wordGroupRequest);

        if (savedWordGroup != null) {

            return ResponseEntity.status(HttpStatus.CREATED).body(savedWordGroup);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create word group");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateMetaData(@PathVariable Long id, @RequestBody WordGroupRequest wordGroupRequest) {
        WordGroupPreviewResponse updatedWordGroup = wordGroupService.update(id, wordGroupRequest);

        if (updatedWordGroup != null) {

            return ResponseEntity.status(HttpStatus.OK).body(updatedWordGroup);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not update group metadata");
    }

    @PatchMapping("/{id}/add-words")
    public ResponseEntity<?> addWordsToGroup(@PathVariable Long id, @RequestBody List<Long> wordIds) {
        WordGroupPreviewResponse updatedWordGroup = wordGroupService.removeOrAddWordsToGroup(id, wordIds, false);


        if (updatedWordGroup != null) {

            return ResponseEntity.status(HttpStatus.OK).body(updatedWordGroup);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not add words");
    }


    @PatchMapping("/{id}/remove-words")
    public ResponseEntity<?> removeWordsFromGroup(@PathVariable Long id, @RequestBody List<Long> wordIds) {
        WordGroupPreviewResponse updatedWordGroup = wordGroupService.removeOrAddWordsToGroup(id, wordIds, true);

        if (updatedWordGroup != null) {

            return ResponseEntity.status(HttpStatus.OK).body(updatedWordGroup);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not remove words");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWordGroup(@PathVariable Long id) {
        wordGroupService.deleteWordGroup(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
