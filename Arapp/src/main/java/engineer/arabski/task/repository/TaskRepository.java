package engineer.arabski.task.repository;


import engineer.arabski.task.model.Task;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @EntityGraph(attributePaths = {"wordReferences", "wordReferences.dictionaryWord"})
    Optional<Task> findById(Long id);

    List<Task> findByTaskType(String taskType);

}
