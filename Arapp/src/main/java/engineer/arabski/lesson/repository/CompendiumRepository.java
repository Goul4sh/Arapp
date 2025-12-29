package engineer.arabski.lesson.repository;

import engineer.arabski.lesson.model.CompendiumEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompendiumRepository extends JpaRepository<CompendiumEntry, Long> {



}
