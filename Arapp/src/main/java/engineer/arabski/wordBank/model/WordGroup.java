package engineer.arabski.wordBank.model;


import engineer.arabski.languageProcessing.model.DictionaryWord;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "word_groups")
@Getter
@Setter
@NoArgsConstructor


public class WordGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    Long id;

    String name;
    String description;
    String icon;
    String imageUrl;

    @ManyToMany
    @JoinTable(
            name = "word_group_mapping",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "word_id")
    )
    private Set<DictionaryWord> words = new HashSet<>();


}
