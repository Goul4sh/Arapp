package engineer.arabski.review.model;

import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
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

    private Integer repetitions = 0;
    private Integer intervalDays = 0;
    private Double easeFactor = 2.5;

    private LocalDateTime nextReviewDate = LocalDateTime.now();

    public FlashcardItem(User owner, DictionaryWord word) {
        this.flashcardOwner = owner;
        this.word = word;
    }


    @ManyToOne
    @JoinColumn(name = "dictionary_word_id")
    private DictionaryWord word;


    @ManyToOne
    @JoinColumn(name = "flashcard_owner_id")
    private User flashcardOwner;

    @ManyToMany(mappedBy = "flashcardItems")
    private List<FlashcardGroup> flashcardGroup = new ArrayList<>();




}
