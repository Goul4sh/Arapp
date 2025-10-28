package engineer.arabski.common.words.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class ArabicWord {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;
    private String word;
    private String partOfSpeech;
    private String meaning;
    private String phoneticTranscription;

}
