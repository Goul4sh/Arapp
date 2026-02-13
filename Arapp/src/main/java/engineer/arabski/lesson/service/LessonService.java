package engineer.arabski.lesson.service;

import engineer.arabski.lesson.dto.LessonPreviewResponse;
import engineer.arabski.lesson.dto.LessonRequest;
import engineer.arabski.lesson.dto.LessonTasksResponse;
import engineer.arabski.lesson.model.Chapter;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.repository.LessonRepository;
import engineer.arabski.review.repository.FlashcardRepository;
import engineer.arabski.task.dto.vocabulary.EnrichedTaskResponse;
import engineer.arabski.task.dto.vocabulary.WordReferenceResponse;
import engineer.arabski.task.model.Task;
import engineer.arabski.task.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.ApplicationContext;
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

    private final ApplicationContext applicationContext;

    private LessonTasksResponse toResponse(Lesson lesson) {
        List<EnrichedTaskResponse> tasks = lesson.getTasks().stream()
                .map(task -> new EnrichedTaskResponse(task.getId(), task.getTaskData(), task.getWordReferencesResponse()))
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
                lesson.getTasks().size(),
                lesson.getOrderIndex());
    }


    @Cacheable(value = "raw_lessons", key = "#lessonId")
    public LessonTasksResponse getRawLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id " + lessonId));
        return toResponse(lesson);
    }

    public LessonTasksResponse findByIdWithFlashcardInfo(Long lessonId, Long userId) {

        LessonService proxy = applicationContext.getBean(LessonService.class);
        LessonTasksResponse rawLesson = proxy.getRawLesson(lessonId);

        Set<Long> allWordIds = rawLesson.tasks().stream()
                .flatMap(t -> t.references().stream())
                .map(WordReferenceResponse::dictionaryWordId)
                .collect(Collectors.toSet());

        Set<Long> existingFlashcardIds;
        if (allWordIds.isEmpty()) {
            existingFlashcardIds = Collections.emptySet();
        } else {
            existingFlashcardIds = flashcardRepository.findAllByWord_IdsAndFlashcardOwner_Id(new ArrayList<>(allWordIds), userId);
        }

        List<EnrichedTaskResponse> enrichedTasks = rawLesson.tasks().stream()
                .map(task -> {

                    boolean needsUpdate = task.references().stream()
                            .anyMatch(ref -> existingFlashcardIds.contains(ref.dictionaryWordId()));

                    if (!needsUpdate) return task;

                    var updatedReferences = task.references().stream()
                            .map(ref -> {
                                boolean isKnown = existingFlashcardIds.contains(ref.dictionaryWordId());
                                if (ref.hasFlashcard() == isKnown) return ref;

                                return new WordReferenceResponse(
                                        ref.dictionaryWordId(),
                                        ref.lemma(),
                                        ref.dictionaryTranslation(),
                                        ref.contextualTranslation(),
                                        ref.transliteration(),
                                        ref.startIndex(),
                                        ref.endIndex(),
                                        isKnown
                                );
                            })
                            .toList();

                    return new EnrichedTaskResponse(task.taskId(), task.data(), updatedReferences);
                })
                .toList();

        return new LessonTasksResponse(enrichedTasks);
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


    @Caching(evict = {
            @CacheEvict(value = "raw_lessons", key = "#lessonId"),
            @CacheEvict(value = "chapter_details", allEntries = true),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
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

    @Caching(evict = {
            @CacheEvict(value = "raw_lessons", key = "#lessonId"),
            @CacheEvict(value = "chapter_details", allEntries = true),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    @Caching(evict = {
            @CacheEvict(value = "raw_lessons", key = "#lessonId"),
            @CacheEvict(value = "chapter_details", allEntries = true),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public void publishLesson(Long lessonId, boolean published) {

        Lesson lesson = findByIdEntity(lessonId);
        if (lesson == null) {
            throw new IllegalArgumentException("Lesson not found with id " + lessonId);
        }

        lesson.setPublished(published);
        lessonRepository.save(lesson);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "raw_lessons", key = "#id"),
            @CacheEvict(value = "chapter_details", allEntries = true),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public void moveLesson(Long id, String direction) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id: " + id));

        int currentIndex = lesson.getOrderIndex();
        int newIndex;

        if (direction.equalsIgnoreCase("up")) {
            newIndex = currentIndex - 1;
            if (newIndex < 0) {
                throw new IllegalArgumentException("Lesson is already at the top");
            }
        } else if (direction.equalsIgnoreCase("down")) {
            newIndex = currentIndex + 1;
            long maxIndex = lessonRepository.count();
            if (newIndex > maxIndex) {
                throw new IllegalArgumentException("Lesson is already at the bottom");
            }
        } else {
            throw new IllegalArgumentException("Invalid direction. Use 'up' or 'down'");
        }

        Lesson otherLesson = lessonRepository.findByOrderIndexAndChapter_Id(newIndex, lesson.getChapter().getId())
                .orElseThrow(() -> new IllegalArgumentException("Cannot find lesson at position " + newIndex));

        lesson.setOrderIndex(newIndex);
        otherLesson.setOrderIndex(currentIndex);

        lessonRepository.save(lesson);
        lessonRepository.save(otherLesson);
    }


    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "raw_lessons", key = "#lessonId"),
            @CacheEvict(value = "chapter_details", allEntries = true),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
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
    @Caching(evict = {
            @CacheEvict(value = "chapter_details", allEntries = true),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public LessonPreviewResponse addLesson(LessonRequest request) {

        Lesson lesson = new Lesson(request.title(), request.description(), request.icon(), request.orderIndex());

        List<Task> tasks = taskRepository.findAllById(request.taskIds());


        if (tasks.size() != request.taskIds().size()) {
            throw new IllegalArgumentException("One or more Task IDs are invalid");
        }

        lesson.setTasks(tasks);

        Lesson databaseLesson = lessonRepository.save(lesson);

        return toPreviewResponse(databaseLesson);
    }


    public List<Lesson> findAllById(List<Long> longs) {

        List<Lesson> tasks = lessonRepository.findAllById(longs);

        if (tasks.size() != longs.size()) {
            throw new IllegalArgumentException("One or more Lesson IDs are invalid");
        }
        return tasks;
    }
}
