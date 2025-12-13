package engineer.arabski.lesson.controller;

import engineer.arabski.lesson.dto.LessonResponse;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.service.LessonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        try {
            LessonResponse lesson = lessonService.findbyId(id);
            return ResponseEntity.status(HttpStatus.OK).body(lesson);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found");
        }

    }

    @PostMapping
    public ResponseEntity<?> createLesson(@RequestBody List<Long> taskIds) {

        try {
            Lesson lesson = new Lesson();
            lessonService.addLesson(taskIds, lesson);
            return ResponseEntity.status(HttpStatus.CREATED).body("Lesson created successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create lesson");
        }

    }


}
