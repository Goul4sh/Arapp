package engineer.arabski.review.model;

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

    public FlashcardItem(User owner, TemporaryWord temporaryWord) {
        this.flashcardOwner = owner;
        this.word = temporaryWord;
    }

    @ManyToOne
    @JoinColumn(name = "temporary_word_id")
    private TemporaryWord word;

//    private Long source_sentence_id;
//    private String context_fragment;

    @ManyToOne
    @JoinColumn(name = "flashcard_owner_id")
    private User flashcardOwner;

    @ManyToMany(mappedBy = "flashcardItems")
    private List<FlashcardGroup> flashcardGroup = new ArrayList<>();




}
