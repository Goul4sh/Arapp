package engineer.arabski.wordBank.repository;

import engineer.arabski.wordBank.model.WordGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WordGroupRepository extends JpaRepository<WordGroup, Long> {
}
