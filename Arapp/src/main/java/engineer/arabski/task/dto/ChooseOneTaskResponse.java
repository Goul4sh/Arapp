package engineer.arabski.task.dto;

import java.util.Set;

public record ChooseOneTaskResponse(

        String type,
        String question,
        String answer,
        Set<String> decoyAnswers


) implements TaskResponse { }
