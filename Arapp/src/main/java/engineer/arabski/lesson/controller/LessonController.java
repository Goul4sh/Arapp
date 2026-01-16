package engineer.arabski.lesson.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.lesson.dto.LessonPreviewResponse;
import engineer.arabski.lesson.dto.LessonRequest;
import engineer.arabski.lesson.dto.LessonTasksResponse;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.service.LessonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }


    @GetMapping
    public ResponseEntity<?> findAll() {

//        List<LessonPreviewResponse> lessons = lessonService.findAll();
//        if (!lessons.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.OK).body(lessons);
//        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "false") boolean includeFlashcardInfo,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        try {

            LessonTasksResponse lesson;

            if (includeFlashcardInfo && customUserDetails != null) {
                lesson = lessonService.findByIdWithFlashcardInfo(id, customUserDetails.getId());
            } else {
                lesson = lessonService.findById(id);
            }

            return ResponseEntity.status(HttpStatus.OK).body(lesson);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found");
        }

    }


    @PatchMapping("/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable Long id, @RequestBody LessonRequest lessonRequest) {
        try {
            LessonPreviewResponse updatedLesson = lessonService.updateLesson(id, lessonRequest);
            return ResponseEntity.status(HttpStatus.OK).body(updatedLesson);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not update lesson");
        }
    }

    @PatchMapping("/{id}/exercises/{taskId}")
    public ResponseEntity<?> addTaskToLesson(@PathVariable Long id, @PathVariable Long taskId) {
        try {

            lessonService.addTaskToLesson(id, taskId);
            return ResponseEntity.status(HttpStatus.OK).body("Task added to lesson successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not add task to lesson");
        }
    }

    @PatchMapping("/{id}/publish/{isPublished}")
    public ResponseEntity<?> publishLesson(@PathVariable Long id, @PathVariable boolean isPublished) {
        try {
            lessonService.publishLesson(id, isPublished);
            return ResponseEntity.status(HttpStatus.OK).body("Lesson published successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not publish lesson");
        }
    }

    @PostMapping
    public ResponseEntity<?> createLesson(@RequestBody LessonRequest lessonRequest) {

        try {
            LessonPreviewResponse lesson = lessonService.addLesson(lessonRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(lesson);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create lesson: ");
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found");
        }
    }



}
