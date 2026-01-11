package engineer.arabski.languageProcessing.repository;


import engineer.arabski.languageProcessing.model.DictionaryWord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DictionaryWordRepository extends JpaRepository<DictionaryWord,Long> {
    Optional<DictionaryWord> findByLemma(String lemma);

    List<DictionaryWord> findByIdIn(List<Long> ids);


    @Query("SELECT w FROM DictionaryWord w WHERE " +
            "(:query IS NULL OR :query = '' OR " +
            "LOWER(w.lemma) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.translation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.root) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<DictionaryWord> searchDictionaryWords(@Param("query") String query, Pageable pageable);



}
