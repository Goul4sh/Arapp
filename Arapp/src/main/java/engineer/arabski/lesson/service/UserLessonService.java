package engineer.arabski.lesson.service;

import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.lesson.model.UserCompleteLesson;
import engineer.arabski.lesson.repository.UserCompletedLessonRepository;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserLessonService {

    private final UserCompletedLessonRepository completedLessonRepository;
    private final LessonService lessonService;
    private final UserService userService;

    public UserLessonService(UserCompletedLessonRepository completedLessonRepository, LessonService lessonService, UserService userService) {
        this.completedLessonRepository = completedLessonRepository;
        this.lessonService = lessonService;
        this.userService = userService;
    }

    @Transactional
    public void markLessonAsCompleted(Long userId, Long lessonId) {

        if (completedLessonRepository.existsByUserIdAndLessonId(userId, lessonId)) {
            return;
        }

        User user = userService.getUserById(userId);

        Lesson lesson = lessonService.findByIdEntity(lessonId);

        UserCompleteLesson completion = new UserCompleteLesson(user, lesson);
        completedLessonRepository.save(completion);
    }

    public List<Long> getCompletedLessonIds(Long userId) {
        return completedLessonRepository.findCompletedLessonIdsByUserId(userId);
    }


}
