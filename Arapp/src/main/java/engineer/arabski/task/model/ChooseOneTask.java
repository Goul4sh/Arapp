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
@Table(name = "choose_one_task")
public class ChooseOneTask extends Task {

    private String answer;
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> decoyAnswers;

}