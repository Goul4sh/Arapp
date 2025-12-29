package engineer.arabski.lesson.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "compendium_tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CompendiumTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String displayName;

    @ManyToMany(mappedBy = "tags")
    private Set<CompendiumEntry> entries = new HashSet<>();


    private Integer sortOrder; 
}