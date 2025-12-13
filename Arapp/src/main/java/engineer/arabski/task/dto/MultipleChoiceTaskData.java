package engineer.arabski.task.dto;

import java.util.Set;

public record MultipleChoiceTaskData(

        String description,
        Set<String> answers,
        Set<String> decoyAnswers

) implements TaskData {
    @Override
    public String type() {
        return "multiple-choice";
    }
}
