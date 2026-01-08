package engineer.arabski.task.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import engineer.arabski.languageProcessing.model.DictionaryWord;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
//@RequiredArgsConstructor

public class TaskWordReference {

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class TaskWordReferenceId implements java.io.Serializable {
        private Long taskId;
        private Long dictionaryWordId;
    }

    @EmbeddedId
    private TaskWordReferenceId id = new TaskWordReferenceId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    @JsonIgnore
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("dictionaryWordId")
    @JoinColumn(name = "word_id")
    private DictionaryWord dictionaryWord;

    private int startIndex;
    private int endIndex;


    public TaskWordReference(Task task, DictionaryWord dictionaryWord, Integer startIndex, Integer endIndex) {
        this.task = task;
        this.dictionaryWord = dictionaryWord;
        this.startIndex = startIndex;
        this.endIndex = endIndex;

        this.id = new TaskWordReferenceId(task.getId(), dictionaryWord.getId());
    }

}
