package engineer.arabski.languageProcessing.repository;


import engineer.arabski.languageProcessing.model.DictionaryWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DictionaryWordRepository extends JpaRepository<DictionaryWord,Integer> {
    Optional<DictionaryWord> findByLemma(String lemma);

    List<DictionaryWord> findByIdIn(List<Long> ids);
}
