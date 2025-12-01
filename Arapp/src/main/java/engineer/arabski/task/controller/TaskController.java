package engineer.arabski.task.controller;


import engineer.arabski.task.dto.TaskResponse;
import engineer.arabski.task.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        Optional<TaskResponse> task = taskService.findById(id);
        if (task.isPresent()) {

            return ResponseEntity.status(HttpStatus.OK).body(task.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

    }


}
