package engineer.arabski.lesson.service;

import engineer.arabski.lesson.dto.ChapterRequest;
import engineer.arabski.lesson.dto.ChapterResponse;
import engineer.arabski.lesson.model.Chapter;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.repository.ChapterRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChapterService {

    private final ChapterRepository chapterRepository;

    private final LessonService lessonService;

    public ChapterService(ChapterRepository chapterRepository, LessonService lessonService) {
        this.chapterRepository = chapterRepository;
        this.lessonService = lessonService;
    }


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

    public ChapterResponse findByIdPublishedOnly(long id) {
        Chapter chapter = chapterRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Chapter not found with id: " + id));

        return toChapterResponse(chapter);
    }


    public void deleteChapter(Long id) {
        chapterRepository.deleteById(id);
    }


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


    public List<ChapterResponse> findAll() {
        return chapterRepository.findAll().stream()
                .map(this::toChapterResponse)
                .toList();
    }

    public List<ChapterResponse> findAllPublished() {

        return chapterRepository.findAll().stream()
                .map(this::toChapterResponsePublishedOnly)
                .toList();
    }


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

    public Chapter addChapter(Chapter chapter) {
        return chapterRepository.save(chapter);
    }

    @Transactional
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
    public ChapterResponse addChapter(ChapterRequest chapterRequest) {

        Chapter chapter = new Chapter(chapterRequest.title(), chapterRequest.description(),chapterRequest.orderIndex());

        if (!(chapterRequest.lessonIds() == null)) {

            List<Lesson> lessons = lessonService.findAllById(chapterRequest.lessonIds());
            chapter.setLessons(lessons);
        } else {
            chapter.setLessons(List.of());
        }

       return toChapterResponsePublishedOnly( chapterRepository.save(chapter));

    }


}
