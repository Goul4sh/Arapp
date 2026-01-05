package engineer.arabski.task.service;

import engineer.arabski.task.dto.*;
import engineer.arabski.task.model.*;
import engineer.arabski.task.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;


    public Optional<TaskData> findById(Long id) {
        return taskRepository.findById(id)
                .map(Task::getTaskData);
    }


    public Task findByIdEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id));
    }


    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public TaskData updateTask(Long taskId, TaskData newTaskData) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));

        task.setTaskData(newTaskData);

        Task updatedTask = taskRepository.save(task);
        return updatedTask.getTaskData();
    }

    @Transactional
    public Task addTask(TaskData taskData) {
        Task task = new Task();

        task.setTaskData(taskData);

        System.out.println("Adding task: " + task.getDescription() + " of type " + task.getTaskType());

        return taskRepository.save(task);
    }

}
