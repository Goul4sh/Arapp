package engineer.arabski.task.controller;


import engineer.arabski.task.dto.TaskData;
import engineer.arabski.task.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

//Uwaga! Na ten moment sciezka zawiera exercises zamiast tasks.
// Bedzie to zmienione w przyszlosci, tak jak pozostale nazwy klas

@RestController
@RequestMapping("/api/exercises")
public class TaskController {


    private final TaskService taskService;


    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


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

        Optional<TaskData> createdTask = taskService.addTask(data);
        if (createdTask.isPresent()) {

            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask.get());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Could not create task");

    }

}
