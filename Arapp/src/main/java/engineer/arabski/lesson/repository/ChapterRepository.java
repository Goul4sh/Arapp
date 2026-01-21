package engineer.arabski.lesson.repository;

import engineer.arabski.lesson.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter,Long> {
    Optional<Chapter> findByOrderIndex(int orderIndex);

}
