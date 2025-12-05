package engineer.arabski.task.dto;

import java.util.Set;

public record ChooseOneTaskData(

        String description,
        String answer,
        Set<String> decoyAnswers


) implements TaskData {
    @Override
    public String type() {
        return "choose-one";
    }
}
