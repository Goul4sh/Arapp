package engineer.arabski.review.repository;

import engineer.arabski.review.model.FlashcardItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<FlashcardItem,Long> {
    List<FlashcardItem> getAllByFlashcardOwner_Id(Long flashcardOwnerId);
}
