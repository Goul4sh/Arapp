package engineer.arabski.task.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "multiple_choice_task")
public class MultipleChoiceTask extends Task {


    public MultipleChoiceTask(String description, Set<String> answers, Set<String> decoyAnswers) {
        this.setTaskType("multiple-choice");
        this.setDescription(description);
        this.answers = answers;
        this.decoyAnswers = decoyAnswers;
    }

    private Set<String> answers;
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> decoyAnswers;

}
