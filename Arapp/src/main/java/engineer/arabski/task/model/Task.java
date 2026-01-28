package engineer.arabski.task.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import engineer.arabski.languageProcessing.model.DictionaryWord;
import engineer.arabski.lesson.model.CompendiumEntry;
import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.task.dto.TaskData;
import engineer.arabski.task.dto.vocabulary.WordReferenceResponse;
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

    //Pole na potrzeby powiązania zadania theory z wpisem w kompendium. W reszcie będzie null.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compendium_entry_id")
    private CompendiumEntry compendiumEntry;


    public void setTaskData(TaskData data) {
        this.taskData = data;

        this.taskType = data != null ? data.type() : null;
        this.description = data != null ? data.description() : null;
    }


    public List<WordReferenceResponse> getWordReferencesResponse() {
        return wordReferences.stream()
                .map(ref -> new WordReferenceResponse(
                        ref.getDictionaryWord().getId(),
                        ref.getDictionaryWord().getLemma(),
                        ref.getDictionaryWord().getTranslation(),
                        ref.getContextualTranslation(),
                        ref.getStartIndex(),
                        ref.getEndIndex(),
                        false
                ))
                .toList();
    }

}
