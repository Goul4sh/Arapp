package engineer.arabski.task.controller;


import engineer.arabski.task.dto.CreateTheoryTaskCompendiumRequest;
import engineer.arabski.task.dto.TaskData;
import engineer.arabski.task.dto.TheoryCompendiumResponse;
import engineer.arabski.task.dto.WritingPreviewResponse;
import engineer.arabski.task.dto.vocabulary.EnrichedTaskRequest;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {

        Optional<TaskData> task = taskService.findById(id);
        if (task.isPresent()) {

            return ResponseEntity.status(HttpStatus.OK).body(task.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTask(@RequestBody TaskData data) {

        Task createdTask = taskService.addTask(data);
        if (createdTask != null) {

            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task");

    }

    @PostMapping("/theory")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTheoryTask(@RequestBody CreateTheoryTaskCompendiumRequest data) {

        TheoryCompendiumResponse createdTask = taskService.addTheoryTask(data);
        if (createdTask != null) {

            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task");

    }

    @PostMapping("/with-vocab/{wordId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTaskWithVocabDataReference(
            @RequestBody TaskData data,
            @PathVariable Long wordId) {

        Task createdTask = taskService.addTaskWithVocabReferences(data, wordId);

        if (createdTask != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task with vocabulary data");
    }

    @PostMapping("/with-vocab")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTaskWithVocabData(
            @RequestBody EnrichedTaskRequest data) {

        Task createdTask = taskService.addTaskWithVocab(data);

        if (createdTask != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task with vocabulary data");
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskData data) {
        TaskData updatedTask = taskService.updateTask(id, data);
        if (updatedTask != null) {

            return ResponseEntity.status(HttpStatus.OK).body(updatedTask);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not update task");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

    }

    @GetMapping("/assisted-writing/preview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAssistedWritingTasks() {
        List<WritingPreviewResponse> taskData = taskService.getAssistedWritingTaskPreviews();
        return ResponseEntity.status(HttpStatus.OK).body(taskData);

    }

    @GetMapping("/assisted-writing/detail/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAssistedWritingTaskDetail(@PathVariable Long id) {
        TaskData taskData = taskService.getAssistedWritingTaskDetail(id);
        if (taskData != null) {
            return ResponseEntity.status(HttpStatus.OK).body(taskData);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
    }


}
