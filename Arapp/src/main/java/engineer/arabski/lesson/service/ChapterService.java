package engineer.arabski.lesson.service;

import engineer.arabski.lesson.dto.ChapterRequest;
import engineer.arabski.lesson.dto.ChapterResponse;
import engineer.arabski.lesson.model.Chapter;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.repository.ChapterRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;

    private final LessonService lessonService;


    public Chapter findByIdEntity(long id) {
        return chapterRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Chapter not found with id: " + id));
    }

    public ChapterResponse toChapterResponse(Chapter chapter) {

        return new ChapterResponse(
                chapter.getId(),
                chapter.getName(),
                chapter.getDescription(),
                chapter.getLessons().stream()
                        .map(lessonService::toPreviewResponse)
                        .toList(),
                chapter.getOrderIndex());

    }

    public ChapterResponse toChapterResponsePublishedOnly(Chapter chapter) {

        return new ChapterResponse(
                chapter.getId(),
                chapter.getName(),
                chapter.getDescription(),
                chapter.getLessons().stream()
                        .filter(Lesson::isPublished)
                        .map(lessonService::toPreviewResponse)
                        .toList(),
                chapter.getOrderIndex());

    }

    public ChapterResponse findById(long id) {
        Chapter chapter = chapterRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Chapter not found with id: " + id));

        return toChapterResponse(chapter);
    }


    @Caching(evict = {
            @CacheEvict(value = "chapter_details", key = "#id"),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public void deleteChapter(Long id) {
        chapterRepository.deleteById(id);
    }

    @Caching(evict = {
            @CacheEvict(value = "chapter_details", allEntries = true),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public void moveChapter(Long id, String direction) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found with id: " + id));

        int currentIndex = chapter.getOrderIndex();
        int newIndex;

        if (direction.equalsIgnoreCase("up")) {
            newIndex = currentIndex - 1;
            if (newIndex < 0) {
                throw new IllegalArgumentException("Chapter is already at the top");
            }
        } else if (direction.equalsIgnoreCase("down")) {
            newIndex = currentIndex + 1;
            long maxIndex = chapterRepository.count();
            if (newIndex > maxIndex) {
                throw new IllegalArgumentException("Chapter is already at the bottom");
            }
        } else {
            throw new IllegalArgumentException("Invalid direction. Use 'up' or 'down'");
        }

        Chapter otherChapter = chapterRepository.findByOrderIndex(newIndex)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find chapter at position " + newIndex));

        chapter.setOrderIndex(newIndex);
        otherChapter.setOrderIndex(currentIndex);

        chapterRepository.save(chapter);
        chapterRepository.save(otherChapter);
    }


    @Cacheable(value = "chapters_list_admin", key = "'all'")
    public List<ChapterResponse> findAll() {
        return chapterRepository.findAll().stream()
                .map(this::toChapterResponse)
                .toList();
    }

    @Cacheable(value = "chapters_list_published", key = "'all'")
    public List<ChapterResponse> findAllPublished() {
        return chapterRepository.findAll().stream()
                .map(this::toChapterResponsePublishedOnly)
                .toList();
    }


    @Caching(evict = {
            @CacheEvict(value = "chapter_details", key = "#id"),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public void editChapter(Long id, ChapterRequest request) {
        Chapter chapter = chapterRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Chapter not found with id: " + id));

        if (request.title() != null) {
            chapter.setName(request.title());
        }

        if (request.description() != null) {
            chapter.setDescription(request.description());
        }

        chapterRepository.save(chapter);
    }


    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "chapter_details", key = "#chapterId"),
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public void addLessonToChapter(Long chapterId, Long lessonId) {

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found with id: " + chapterId));
        Lesson lesson = lessonService.findByIdEntity(lessonId);

        if (lesson == null) {
            throw new IllegalArgumentException("Lesson not found with id: " + lessonId);
        }

        chapter.addLesson(lesson);
        chapterRepository.save(chapter);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "chapters_list_published", allEntries = true),
            @CacheEvict(value = "chapters_list_admin", allEntries = true)
    })
    public ChapterResponse addChapter(ChapterRequest chapterRequest) {

        Chapter chapter = new Chapter(chapterRequest.title(), chapterRequest.description(), chapterRequest.orderIndex());

        if (!(chapterRequest.lessonIds() == null)) {

            List<Lesson> lessons = lessonService.findAllById(chapterRequest.lessonIds());
            chapter.setLessons(lessons);
        } else {
            chapter.setLessons(List.of());
        }

        return toChapterResponsePublishedOnly(chapterRepository.save(chapter));
    }

}
