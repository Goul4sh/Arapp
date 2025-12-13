package engineer.arabski.task.dto;

public record FillInTheBlankTaskData(

        String description,
        String answer,
        String sentenceWithBlank

) implements TaskData {

    @Override
    public String type() {
        return "fill-in-the-blank";
    }

}
