package engineer.arabski.wordBank.service;

import engineer.arabski.lesson.dto.LessonTasksResponse;
import engineer.arabski.lesson.repository.UserCompletedLessonRepository;
import engineer.arabski.lesson.service.LessonService;
import engineer.arabski.task.dto.vocabulary.EnrichedTaskResponse;
import engineer.arabski.task.dto.vocabulary.WordReferenceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RecentWordsService {

    private final UserCompletedLessonRepository userCompletedLessonRepository;
    private final LessonService lessonService;

    public List<WordReferenceResponse> getWordReferencesForRecentWords(Long userId) {
        List<Long> lastCompletedLessonId = userCompletedLessonRepository.findRecentCompletedLessonsByUserId(userId);
        if (lastCompletedLessonId.isEmpty()) {
            return null;
        }

        Set<WordReferenceResponse> wordReferences = new HashSet<>();

        for (Long lessonId : lastCompletedLessonId) {
            LessonTasksResponse response = lessonService.findByIdWithFlashcardInfo(lessonId, userId);
            response.tasks().stream()
                    .map(EnrichedTaskResponse::references)
                    .forEach(wordReferences::addAll);
        }

        return new ArrayList<>(wordReferences);
    }


}
