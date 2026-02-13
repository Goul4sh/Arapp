package engineer.arabski.task.dto;

import java.util.List;

public record AssistedWritingTaskData(

        String letterName,
        String letterForm,

        String description,
        String viewBox,
        List<String> svgPathStrokes

) implements TaskData {
    @Override
    public String type() {
        return "writing-assisted";
    }
}
