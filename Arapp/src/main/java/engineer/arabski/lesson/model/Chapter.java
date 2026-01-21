package engineer.arabski.lesson.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Chapter {

    public Chapter(String name, String description, int orderIndex) {
        this.name = name;
        this.description = description;
        this.orderIndex = orderIndex;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private String name;

    private String description;

    @OneToMany(mappedBy = "chapter",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lesson> lessons;

    private int orderIndex;

    public void addLesson(Lesson lesson) {
        lessons.add(lesson);
        lesson.setChapter(this);
    }

    public void removeLesson(Lesson lesson) {
        lessons.remove(lesson);
        lesson.setChapter(null);
    }


}
