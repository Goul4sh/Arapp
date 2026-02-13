package engineer.arabski.taskGeneration.controller;

import engineer.arabski.task.dto.TaskData;
import engineer.arabski.taskGeneration.dto.GeneratedTaskResponse;
import engineer.arabski.taskGeneration.dto.MorphologyRequest;
import engineer.arabski.taskGeneration.service.TaskGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-generation")
@RequiredArgsConstructor
public class TaskGenerationController {


    private final TaskGenerationService taskGenerationService;


    @PostMapping("/morphology-forms")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateMorphologyFormsTask(@RequestBody MorphologyRequest request) {

        List<TaskData> task = taskGenerationService.generateMorphologyFormsTasks(List.of(request), 1);
        if (task != null) {
            return ResponseEntity.status(HttpStatus.OK).body(task.getFirst());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

    }

    @PostMapping("/morphology-parts")
    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<?> generateMorphologyPartsTask(@RequestBody MorphologyRequest request) {

        List<TaskData> task = taskGenerationService.generateMorphologyPartsTasks(List.of(request), 1);
        if (task != null) {
            return ResponseEntity.status(HttpStatus.OK).body(task.getFirst());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

    }

    @GetMapping("/groups/{wordGroupId}")
    public ResponseEntity<?> generateTaskSetForGroup(
            @PathVariable Long wordGroupId,
            @RequestParam(defaultValue = "10") int count) {

        List<GeneratedTaskResponse> tasks = taskGenerationService.generateTasksForWordGroup(wordGroupId, count);
        if (tasks != null && !tasks.isEmpty()) {

            return ResponseEntity.status(HttpStatus.OK).body(tasks);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tasks not found");

    }

}
