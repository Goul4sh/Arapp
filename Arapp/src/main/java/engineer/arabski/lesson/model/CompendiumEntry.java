package engineer.arabski.lesson.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "compendium_entries")

public class CompendiumEntry {

    public CompendiumEntry(String description, String title, String icon, String content, Long requiredLessonId, Set<CompendiumTag> tags) {
        this.description = description;
        this.title = title;
        this.icon = icon;
        this.content = content;
        this.requiredLessonId = requiredLessonId;
        this.tags = tags;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private String description;
    private String title;
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Long requiredLessonId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "compendium_entry_tags",
            joinColumns = @JoinColumn(name = "entry_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<CompendiumTag> tags;
    private boolean isPublished = false;

}
