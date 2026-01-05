package engineer.arabski.lesson.model;

import engineer.arabski.task.model.Task;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Lesson {

    public Lesson(String name, String description, String icon) {
        this.name = name;
        this.description = description;
        this.icon = icon;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;


    private String name;
    private String description;

    private String icon;

    private boolean isPublished = false;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "lesson_task",
            joinColumns = @JoinColumn(name = "lesson_id"),
            inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    private List<Task> tasks = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

}
