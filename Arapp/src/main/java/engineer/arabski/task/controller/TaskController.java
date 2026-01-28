package engineer.arabski.task.controller;


import engineer.arabski.task.dto.CreateTheoryTaskCompendiumRequest;
import engineer.arabski.task.dto.TaskData;
import engineer.arabski.task.dto.TheoryCompendiumResponse;
import engineer.arabski.task.dto.vocabulary.EnrichedTaskRequest;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

//Uwaga! Na ten moment sciezka zawiera exercises zamiast tasks.
// Bedzie to zmienione w przyszlosci, tak jak pozostale nazwy klas

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
    public ResponseEntity<?> createTask(@RequestBody TaskData data) {

        Task createdTask = taskService.addTask(data);
        if (createdTask != null) {

            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task");

    }

    @PostMapping("/theory")
    public ResponseEntity<?> createTheoryTask(@RequestBody CreateTheoryTaskCompendiumRequest data) {

        TheoryCompendiumResponse createdTask = taskService.addTheoryTask(data);
        if (createdTask != null) {

            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task");

    }


    @PostMapping("/with-vocab/{wordId}")
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
    public ResponseEntity<?> createTaskWithVocabData(
            @RequestBody EnrichedTaskRequest data) {

        Task createdTask = taskService.addTaskWithVocab(data);

        if (createdTask != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task with vocabulary data");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskData data) {
        TaskData updatedTask = taskService.updateTask(id, data);
        if (updatedTask != null) {

            return ResponseEntity.status(HttpStatus.OK).body(updatedTask);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not update task");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

    }
}
