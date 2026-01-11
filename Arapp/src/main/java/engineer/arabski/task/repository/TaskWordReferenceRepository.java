package engineer.arabski.task.repository;

import engineer.arabski.task.model.TaskWordReference;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskWordReferenceRepository extends CrudRepository<TaskWordReference, Long> {
    void deleteByDictionaryWord_Id(Long dictionaryWordId);
}
