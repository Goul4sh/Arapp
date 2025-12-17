package engineer.arabski.review.repository;

import engineer.arabski.review.model.TemporaryWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemporaryWordRepository extends JpaRepository<TemporaryWord, Long> {
}
