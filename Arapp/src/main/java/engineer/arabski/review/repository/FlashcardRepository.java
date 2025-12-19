package engineer.arabski.review.repository;

import engineer.arabski.review.model.FlashcardItem;
import engineer.arabski.statistics.dto.UserStatsAggregation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<FlashcardItem,Long> {
    List<FlashcardItem> getAllByFlashcardOwner_Id(Long flashcardOwnerId);

    @Query("SELECT f FROM FlashcardItem f JOIN f.flashcardGroup g WHERE g.id = :groupId AND f.nextReviewDate <= :now")
    List<FlashcardItem> findDueFlashcardsInGroup(@Param("groupId") Long groupId, @Param("now") LocalDateTime now);
}
