package engineer.arabski.review.repository;

import engineer.arabski.review.model.FlashcardGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardGroupRepository extends JpaRepository<FlashcardGroup,Long> {

    Optional<FlashcardGroup> findByOwner_Id(Long ownerId);

    Optional<FlashcardGroup> findByOwner_IdAndIsDefaultTrue(Long ownerId);

    List<FlashcardGroup> findAllByOwner_Id(Long ownerId);
}
