package engineer.arabski.review.model;


import engineer.arabski.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class FlashcardGroup {


    public FlashcardGroup(String name, String description, String category, User owner) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.owner = owner;
    }


    public FlashcardGroup(String name, String description, String category, User owner, List<FlashcardItem> flashcardItems) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.owner = owner;
        this.flashcardItems = flashcardItems;
    }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    private String name;
    private String description;
    private String category;
    private boolean isDefault = false;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;


    @ManyToMany
    @JoinTable(
            name = "flashcard_group_items",
            joinColumns = @JoinColumn(name = "flashcard_group_id"),
            inverseJoinColumns = @JoinColumn(name = "flashcard_item_id")
    )
    private List<FlashcardItem> flashcardItems = new ArrayList<>();


}
