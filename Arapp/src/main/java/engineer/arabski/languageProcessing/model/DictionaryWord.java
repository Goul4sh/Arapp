package engineer.arabski.languageProcessing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dictionary_words")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DictionaryWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String lemma;

    private String root;
    private String partOfSpeech;
    private String diacritic;

    private String translation;

    private  String transliteration;

}
