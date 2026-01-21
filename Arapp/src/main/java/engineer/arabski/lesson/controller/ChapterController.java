package engineer.arabski.lesson.controller;

import engineer.arabski.lesson.dto.ChapterRequest;
import engineer.arabski.lesson.dto.ChapterResponse;
import engineer.arabski.lesson.service.ChapterService;
import org.apache.coyote.Response;
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

    @GetMapping("/published")
    public ResponseEntity<?> findAllPublished() {

        return ResponseEntity.status(HttpStatus.OK).body(chapterService.findAllPublished());

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

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateChapter(@PathVariable Long id ,@RequestBody ChapterRequest chapterRequest) {

        try {

            chapterService.editChapter(id, chapterRequest);
            return ResponseEntity.status(HttpStatus.OK).body("Chapter updated successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not update chapter");
        }

    }

    @PatchMapping("/{id}/position")
    public ResponseEntity<?> updateChapterPosition(@PathVariable Long id, @RequestParam("direction") String direction) {
        try {
            chapterService.moveChapter(id, direction);
            return ResponseEntity.status(HttpStatus.OK).body("Chapter position updated successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PatchMapping("/{id}/lessons/{lessonId}")
    public ResponseEntity<?> addLessonToChapter(@PathVariable Long id, @PathVariable Long lessonId) {
        try {
            chapterService.addLessonToChapter(id, lessonId);
            return ResponseEntity.status(HttpStatus.OK).body("Lesson added to chapter successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not add lesson to chapter");
        }
        }

    @PostMapping
    public ResponseEntity<?> createChapter(@RequestBody ChapterRequest chapterRequest) {

        try {

           ChapterResponse response = chapterService.addChapter(chapterRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create chapter");
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChapter(@PathVariable Long id) {
        try {
            chapterService.deleteChapter(id);
            return ResponseEntity.status(HttpStatus.OK).body("Chapter deleted successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chapter not found");
        }
    }

}
