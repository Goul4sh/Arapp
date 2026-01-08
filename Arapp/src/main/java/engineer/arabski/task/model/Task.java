package engineer.arabski.task.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.task.dto.TaskData;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "task_type")
    private String taskType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private TaskData taskData;

    private String description;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @JsonIgnore
    private Lesson lesson;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "task", orphanRemoval = true)
    private List<TaskWordReference> wordReferences = new ArrayList<>();


    public void setTaskData(TaskData data) {
        this.taskData = data;

        this.taskType = data != null ? data.type() : null;
        this.description = data != null ? data.description() : null;
    }


}
