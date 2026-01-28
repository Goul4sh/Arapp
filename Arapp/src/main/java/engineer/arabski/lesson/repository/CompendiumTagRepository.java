package engineer.arabski.lesson.repository;

import engineer.arabski.lesson.model.CompendiumTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CompendiumTagRepository  extends JpaRepository<CompendiumTag,Long> {
    Optional<CompendiumTag> getByName(String name);

    Set<CompendiumTag> findAllByNameIn(Iterable<String> names);

    boolean existsByName(String name);

}
