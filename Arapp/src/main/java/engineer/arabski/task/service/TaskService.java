package engineer.arabski.task.service;

import engineer.arabski.task.dto.ChooseOneTaskResponse;
import engineer.arabski.task.dto.TaskResponse;
import engineer.arabski.task.model.ChooseOneTask;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    //TODO dodać więcej typów zadań
    private TaskResponse toResponse(Task task) {

        return switch (task) {

            case ChooseOneTask t -> new ChooseOneTaskResponse(
                    t.getTaskType(),
                    t.getDescription(),
                    t.getAnswer(),
                    t.getDecoyAnswers()
            );

            default -> throw new IllegalStateException("Unexpected value: " + task);
        };

    }


    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    public Optional<TaskResponse> findById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id));
        return Optional.of(toResponse(task));


    }

    public void addTask(Task task) {
        taskRepository.save(task);
    }


}
