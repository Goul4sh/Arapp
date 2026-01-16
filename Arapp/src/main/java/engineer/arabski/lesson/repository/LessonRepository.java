package engineer.arabski.lesson.repository;

import engineer.arabski.lesson.model.Lesson;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson,Long> {

    @EntityGraph(attributePaths = {
            "tasks",
            "tasks.wordReferences",
            "tasks.wordReferences.dictionaryWord"
    })
    Optional<Lesson> findById(Long id);


}
