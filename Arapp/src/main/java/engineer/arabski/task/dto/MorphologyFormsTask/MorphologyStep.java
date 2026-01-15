package engineer.arabski.task.dto.MorphologyFormsTask;

import java.util.List;

public record MorphologyStep(
        int stepIndex,
        List<MorphologyOption> options) {
}
