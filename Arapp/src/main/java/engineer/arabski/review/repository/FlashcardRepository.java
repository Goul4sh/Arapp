package engineer.arabski.review.repository;

import engineer.arabski.review.model.FlashcardItem;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface FlashcardRepository extends JpaRepository<FlashcardItem,Long> {
    List<FlashcardItem> getAllByFlashcardOwner_Id(Long flashcardOwnerId);

    List<FlashcardItem> getAllByFlashcardGroup_Id(Long flashcardGroupId);

    @Query("SELECT f FROM FlashcardItem f JOIN f.flashcardGroup g WHERE g.id = :groupId AND f.nextReviewDate <= :now")
    List<FlashcardItem> findDueFlashcardsInGroup(@Param("groupId") Long groupId, @Param("now") LocalDateTime now);

    @Query("SELECT count(f) FROM FlashcardItem f WHERE f.flashcardOwner.id = :ownerId AND f.nextReviewDate <= :now")
    Long countDueFlashcardsByOwner_Id(@Param("ownerId") Long ownerId, @Param("now") LocalDateTime now);

    @Query("SELECT f.word.id FROM FlashcardItem f WHERE f.word.id IN :wordIds AND f.flashcardOwner.id = :ownerId")
    Set<Long> findAllByWord_IdsAndFlashcardOwner_Id(@Param("wordIds") List<Long> wordIds, @Param("ownerId") Long ownerId);

    @Transactional
    @Modifying
    @Query("DELETE FROM FlashcardItem f WHERE f.flashcardOwner.id = :ownerId AND f.word.id = :wordId")
    void deleteByFlashcardOwner_IdAndWord_Id(@Param("ownerId") Long ownerId, @Param("wordId") Long wordId);


}
