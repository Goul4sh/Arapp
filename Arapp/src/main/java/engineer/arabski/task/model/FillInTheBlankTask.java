package engineer.arabski.task.model;


import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity

public class FillInTheBlankTask extends Task {

    public FillInTheBlankTask(String description, String answer, String sentenceWithBlank) {
        this.setTaskType("fill-in-the-blank");
        this.setDescription(description);
        this.answer = answer;
        this.sentenceWithBlank = sentenceWithBlank;
    }

    private String answer;
    private String sentenceWithBlank;

}
