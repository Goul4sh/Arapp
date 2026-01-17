package engineer.arabski.lesson.repository;

import engineer.arabski.lesson.model.UserCompleteLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCompletedLessonRepository extends JpaRepository <UserCompleteLesson, Long> {


    boolean existsByUserIdAndLessonId(Long userId, Long lessonId);

    // Zwraca listę samych ID lekcji dla użytkownika (bardzo wydajne zapytanie)
    @Query("SELECT cl.lesson.Id FROM UserCompleteLesson cl WHERE cl.user.id = :userId")
    List<Long> findCompletedLessonIdsByUserId(Long userId);

    //TODO kiedy dojdzie do zmiany numerowania lekcji z id na osobne pole numeracji, zmienić to zapytanie

    @Query("SELECT MAX(cl.lesson.Id) FROM UserCompleteLesson cl WHERE cl.user.id = :userId")
    Long findLastCompletedLessonByUserId(Long userId);

    @Query("SELECT cl.lesson.Id FROM UserCompleteLesson cl WHERE cl.user.id = :userId order by  cl.completedAt DESC limit 3")
    List<Long> findRecentCompletedLessonsByUserId(Long userId);


}
