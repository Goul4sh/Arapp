package engineer.arabski.lesson.repository;

import engineer.arabski.lesson.model.CompendiumEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompendiumRepository extends JpaRepository<CompendiumEntry, Long> {

List<CompendiumEntry> findAllByIsPublishedTrue();

}
