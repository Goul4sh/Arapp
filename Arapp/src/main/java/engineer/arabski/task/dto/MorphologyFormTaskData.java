package engineer.arabski.task.dto;

import java.util.List;

public record MorphologyFormTaskData(

        String question,
        List<MorphologyStep> steps

) implements TaskData {
    @Override
    public String type() {
        return "morphology-form";
    }

    @Override
    public String description() {
        return question;
    }

}

record MorphologyStep(
        int stepIndex,
        String correctId,
        List<MorphologyOption> options) {
}

record MorphologyOption(
        String id,
        String content,
        boolean isCorrect
) {
}