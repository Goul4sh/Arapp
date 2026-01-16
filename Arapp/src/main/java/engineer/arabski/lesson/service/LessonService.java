package engineer.arabski.lesson.service;

import engineer.arabski.lesson.dto.LessonPreviewResponse;
import engineer.arabski.lesson.dto.LessonRequest;
import engineer.arabski.lesson.dto.LessonTasksResponse;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.repository.LessonRepository;
import engineer.arabski.review.repository.FlashcardRepository;
import engineer.arabski.task.dto.vocabulary.EnrichedTaskResponse;
import engineer.arabski.task.dto.vocabulary.WordReferenceResponse;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;

    private final FlashcardRepository flashcardRepository;

    private final TaskRepository taskRepository;

    private LessonTasksResponse toResponse(Lesson lesson) {
        List<EnrichedTaskResponse> tasks = lesson.getTasks().stream()
                .map(task -> new EnrichedTaskResponse(task.getTaskData(), task.getWordReferencesResponse()))
                .toList();

        return new LessonTasksResponse(tasks);
    }


    private LessonTasksResponse toResponseWithFlashcard(Lesson lesson, Long userId) {

        Set<Long> allWordIds = lesson.getTasks().stream()
                .flatMap(t -> t.getWordReferencesResponse().stream())
                .map(WordReferenceResponse::dictionaryWordId)
                .collect(Collectors.toSet());

        Set<Long> existingFlashcardIds;

        if (allWordIds.isEmpty()) {
            existingFlashcardIds = Collections.emptySet();
        } else {
            existingFlashcardIds = flashcardRepository.findAllByWord_IdsAndFlashcardOwner_Id(new ArrayList<>(allWordIds), userId);
        }

        List<EnrichedTaskResponse> tasks = lesson.getTasks().stream()
                .map(task -> {
                    var updatedReferences = task.getWordReferencesResponse().stream()
                            .map(ref -> {
                                boolean isKnown = existingFlashcardIds.contains(ref.dictionaryWordId());

                                return new WordReferenceResponse(
                                        ref.dictionaryWordId(),
                                        ref.lemma(),
                                        ref.dictionaryTranslation(),
                                        ref.contextualTranslation(),
                                        ref.startIndex(),
                                        ref.endIndex(),
                                        isKnown
                                );
                            })
                            .toList();

                    return new EnrichedTaskResponse(task.getTaskData(), updatedReferences);
                })
                .toList();

        return new LessonTasksResponse(tasks);
    }

    public LessonPreviewResponse toPreviewResponse(Lesson lesson) {
        return new LessonPreviewResponse(
                lesson.getId(),
                lesson.getName(),
                lesson.getDescription(),
                lesson.getIcon(),
                lesson.isPublished(),
                lesson.getTasks().size()
        );
    }


    public LessonPreviewResponse updateLesson(Long lessonId, LessonRequest request) {

        Lesson lesson = findByIdEntity(lessonId);

        if (lesson == null) {
            throw new IllegalArgumentException("Lesson not found with id " + lessonId);
        }

        if (request.title() != null) {
            lesson.setName(request.title());
        }

        if (request.description() != null) {
            lesson.setDescription(request.description());
        }
        if (request.icon() != null) {
            lesson.setIcon(request.icon());
        }

        // Taski są zmieniane innym endpointem

        Lesson updatedLesson = lessonRepository.save(lesson);
        return toPreviewResponse(updatedLesson);
    }

    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    public LessonTasksResponse findById(Long lessonId) {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id " + lessonId));

        return toResponse(lesson);

    }

    public LessonTasksResponse findByIdWithFlashcardInfo(Long lessonId, Long userId) {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id " + lessonId));

        return toResponseWithFlashcard(lesson, userId);

    }


    public Lesson findByIdEntity(Long lessonId) {

        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id " + lessonId));

    }

    public Lesson findByIdEntityOrNull(Long lessonId) {
        return lessonRepository.findById(lessonId).orElse(null);
    }

    public void publishLesson(Long lessonId, boolean published) {

        Lesson lesson = findByIdEntity(lessonId);

        if (lesson == null) {
            throw new IllegalArgumentException("Lesson not found with id " + lessonId);
        }

        lesson.setPublished(published);

        lessonRepository.save(lesson);

    }


    @Transactional
    public void addTaskToLesson(Long lessonId, Long taskId) {

        Lesson lesson = findByIdEntity(lessonId);
        if (lesson == null) {
            throw new IllegalArgumentException("Lesson not found with id " + lessonId);
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id " + taskId));

        lesson.addTask(task);
        taskRepository.save(task);

    }

    @Transactional
    public LessonPreviewResponse addLesson(LessonRequest request) {

        Lesson lesson = new Lesson(request.title(), request.description(), request.icon());

        List<Task> tasks = taskRepository.findAllById(request.taskIds());


        if (tasks.size() != request.taskIds().size()) {
            System.out.println("Requested Task IDs: " + request.taskIds());
            throw new IllegalArgumentException("One or more Task IDs are invalid");
        }

        lesson.setTasks(tasks);

        Lesson databaseLesson = lessonRepository.save(lesson);

        return toPreviewResponse(databaseLesson);
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
