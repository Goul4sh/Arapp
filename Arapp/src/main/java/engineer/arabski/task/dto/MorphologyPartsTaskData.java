package engineer.arabski.task.dto;

import java.util.List;

public record MorphologyPartsTaskData(

 String description,
 String question,
 List<String> correctOrder,
 List<MorphologySegment> segments,
 List<MorphologySegment> decoySegments


) implements TaskData {
    @Override
    public String type() {
        return "morphology-parts";
    }
}

