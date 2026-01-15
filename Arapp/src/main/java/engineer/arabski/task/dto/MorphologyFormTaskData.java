package engineer.arabski.task.dto;

import engineer.arabski.task.dto.MorphologyFormsTask.MorphologyStep;

import java.util.List;

public record MorphologyFormTaskData(

        String description,
        String question,
        List<MorphologyStep> steps

) implements TaskData {
    @Override
    public String type() {
        return "morphology-form";
    }

}

