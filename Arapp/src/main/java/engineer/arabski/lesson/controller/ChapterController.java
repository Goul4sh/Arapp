package engineer.arabski.lesson.controller;

import engineer.arabski.lesson.dto.ChapterRequest;
import engineer.arabski.lesson.dto.ChapterResponse;
import engineer.arabski.lesson.service.ChapterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {



    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }


    @GetMapping
    public ResponseEntity<?> findAll() {

        return ResponseEntity.status(HttpStatus.OK).body(chapterService.findAll());

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        try {
            ChapterResponse chapter = chapterService.findById(id);
            return ResponseEntity.status(HttpStatus.OK).body(chapter);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chapter not found");
        }

    }

    @PostMapping
    public ResponseEntity<?> createChapter(@RequestBody ChapterRequest chapterRequest) {

        try {

            chapterService.addChapter(chapterRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Chapter created successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create chapter");
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChapter(@PathVariable Long id) {
        try {
//            chapterService.deleteChapter(id);
            return ResponseEntity.status(HttpStatus.OK).body("Chapter deleted successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chapter not found");
        }
    }

}
