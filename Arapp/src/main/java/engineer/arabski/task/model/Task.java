package engineer.arabski.task.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "tasks")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    private String taskType;
    private String description;


}
