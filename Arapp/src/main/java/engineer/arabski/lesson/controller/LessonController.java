package engineer.arabski.lesson.controller;

import engineer.arabski.lesson.dto.LessonRequest;
import engineer.arabski.lesson.dto.LessonTasksResponse;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.service.LessonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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


        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        try {
            LessonTasksResponse lesson = lessonService.findById(id);
            return ResponseEntity.status(HttpStatus.OK).body(lesson);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lesson not found");
        }

    }

    @PostMapping
    public ResponseEntity<?> createLesson(@RequestBody LessonRequest lessonRequest) {

        try {
            lessonService.addLesson(lessonRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Lesson created successfully");

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
