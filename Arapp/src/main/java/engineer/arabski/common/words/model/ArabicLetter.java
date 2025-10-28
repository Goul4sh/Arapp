package engineer.arabski.common.words.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class ArabicLetter {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    private String letterName;
    private String phoneticTranscription;
    private String letterSymbol;
    private String initialForm;
    private String medialForm;
    private String finalForm;
    private String isolatedForm;



}
