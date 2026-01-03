package engineer.arabski.lesson.service;

import engineer.arabski.lesson.dto.LessonPreviewResponse;
import engineer.arabski.lesson.dto.LessonRequest;
import engineer.arabski.lesson.dto.LessonTasksResponse;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.repository.LessonRepository;
import engineer.arabski.task.dto.TaskData;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;

    private final TaskRepository taskRepository;


    public LessonService(LessonRepository lessonRepository, TaskRepository taskRepository) {
        this.lessonRepository = lessonRepository;
        this.taskRepository = taskRepository;
    }

    private LessonTasksResponse toResponse(Lesson lesson) {
        List<Task> tasks = lesson.getTasks();
        List<TaskData> taskDataList = tasks.stream()
                .map(Task::getTaskData)
                .toList();

        return new LessonTasksResponse(taskDataList);
    }

    public LessonPreviewResponse toPreviewResponse(Lesson lesson) {
        return new LessonPreviewResponse(
                lesson.getId(),
                lesson.getName(),
                lesson.getDescription(),
                lesson.getIcon()
        );
    }

    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    public LessonTasksResponse findById(Long lessonId) {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id " + lessonId));

        return toResponse(lesson);

    }

    public Lesson findByIdEntity(Long lessonId) {

        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id " + lessonId));

    }

    public Lesson findByIdEntityOrNull(Long lessonId) {
        return lessonRepository.findById(lessonId).orElse(null);
    }


    @Transactional
    public void addLesson(LessonRequest request) {

        System.out.println("Wszedlem do addLesson w LessonService");

        Lesson lesson = new Lesson(request.title(), request.description(), request.icon());

        List<Task> tasks = taskRepository.findAllById(request.taskIds());


        if (tasks.size() != request.taskIds().size()) {
            System.out.println("Requested Task IDs: " + request.taskIds());
//            System.out.println("Found Tasks: " + tasks.stream().map(Task::getId).toList());
            throw new IllegalArgumentException("One or more Task IDs are invalid");
        }

        lesson.setTasks(tasks);

        lessonRepository.save(lesson);

    }


    public List<Lesson> findAllById(List<Long> longs) {

        List<Lesson> tasks = lessonRepository.findAllById(longs);

        if (tasks.size() != longs.size()) {
            System.out.println("Requested Lesson IDs: " + longs);
            throw new IllegalArgumentException("One or more Lesson IDs are invalid");
        }
        return tasks;
    }
}
