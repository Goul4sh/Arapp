package engineer.arabski.lesson.service;

import engineer.arabski.lesson.dto.LessonResponse;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.repository.LessonRepository;
import engineer.arabski.task.dto.TaskData;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;

    private final TaskService taskService;


    public LessonService(LessonRepository lessonRepository, TaskService taskService) {
        this.lessonRepository = lessonRepository;
        this.taskService = taskService;
    }

    private LessonResponse toResponse(Lesson lesson) {
        List<Task> tasks = lesson.getTasks();
        List<TaskData> taskDataList = tasks.stream()
                .map(taskService::toResponse)
                .toList();

        return new LessonResponse(taskDataList);
    }


    private void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    public LessonResponse findbyId(Long lessonId) {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id " + lessonId));

        return toResponse(lesson);

    }

    // Zakładamy że lista taskIds nie jest pusta. Poprawność id sprawdzana jest w taskService
    public void addLesson(List<Long> task_ids, Lesson lesson) {

        List<Task> tasks = task_ids.stream()
                .map(taskService::findByIdEntity)
                .toList();

        lesson.setTasks(tasks);

        lessonRepository.save(lesson);

    }


}
