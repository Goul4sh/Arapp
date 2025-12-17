package engineer.arabski.review.model;

import engineer.arabski.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@NoArgsConstructor
public class FlashcardItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

//    private String wordArabic;
//    private String wordTranslation;
//    private String Transliteration;

    public FlashcardItem(User owner, TemporaryWord temporaryWord) {
        this.flashcardOwner = owner;
        this.word = temporaryWord;
    }

    @ManyToOne
    @JoinColumn(name = "temporary_word_id")
    private TemporaryWord word;

    @ManyToOne
    @JoinColumn(name = "flashcard_owner_id")
    private User flashcardOwner;

   @ManyToMany(mappedBy = "flashcardItems")
    private List<FlashcardGroup> flashcardGroup = new ArrayList<>();

/// TODO zastanowic sie nad typem danych dla interwału!
    private Long repetitionInterval = 0L;

//    private Long source_sentence_id;
//    private String context_fragment;


}
