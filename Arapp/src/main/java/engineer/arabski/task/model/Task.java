package engineer.arabski.task.model;

import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.task.dto.TaskData;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder


@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name="task_type")
    private String taskType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private TaskData taskData;

    private String description;

    @ManyToMany(mappedBy = "tasks")
    private List<Lesson> lessons = new ArrayList<>();


    public void setTaskData(TaskData data) {
        this.taskData = data;

        this.taskType = data != null ? data.type() : null;
        this.description = data != null ? data.description() : null;
    }

}
