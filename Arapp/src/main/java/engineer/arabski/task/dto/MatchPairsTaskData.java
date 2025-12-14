package engineer.arabski.task.dto;

import java.util.Map;

public record MatchPairsTaskData(

        String description,
        Map<String, String> pairs

) implements TaskData {
    @Override
    public String type() {
        return "match-pairs";
    }
}
