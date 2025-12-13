package engineer.arabski.task.service;

import engineer.arabski.task.dto.ChooseOneTaskData;
import engineer.arabski.task.dto.MultipleChoiceTaskData;
import engineer.arabski.task.dto.TaskData;
import engineer.arabski.task.model.ChooseOneTask;
import engineer.arabski.task.model.MultipleChoiceTask;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    //TODO dodać więcej typów zadań
    public TaskData toResponse(Task task) {

        return switch (task) {

            case ChooseOneTask t -> new ChooseOneTaskData(

                    t.getDescription(),
                    t.getAnswer(),
                    t.getDecoyAnswers()
            );

            case MultipleChoiceTask t -> new MultipleChoiceTaskData(
                    t.getDescription(),
                    t.getAnswers(),
                    t.getDecoyAnswers()
            );

            default -> throw new IllegalStateException("Unexpected value: " + task);
        };

    }

    private Task toEntity(TaskData taskData) {

        return switch (taskData) {

            case ChooseOneTaskData t -> {
                ChooseOneTask task = new ChooseOneTask();
                task.setTaskType(t.type());
                task.setDescription(t.description());
                task.setAnswer(t.answer());
                task.setDecoyAnswers(t.decoyAnswers());
                yield task;
            }
            case MultipleChoiceTaskData t -> {
                MultipleChoiceTask task = new MultipleChoiceTask();
                task.setTaskType(t.type());
                task.setDescription(t.description());
                task.setAnswers(t.answers());
                task.setDecoyAnswers(t.decoyAnswers());
                yield task;
            }

            default -> throw new IllegalStateException("Unexpected value: " + taskData);
        };

    }


    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    public Optional<TaskData> findById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id));
        return Optional.of(toResponse(task));

    }

    public Task findByIdEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id));
    }

    public Optional<TaskData> addTask(TaskData task) {

        Task taskToAdd = toEntity(task);

        System.out.println("Adding task: " + taskToAdd.getDescription() + " of type " + taskToAdd.getTaskType());

        Task savedTask = taskRepository.save(taskToAdd);
        return Optional.of(toResponse(savedTask));
    }


//    public void addTask(Task task) {
//
//        taskRepository.save(task);
//    }


}
