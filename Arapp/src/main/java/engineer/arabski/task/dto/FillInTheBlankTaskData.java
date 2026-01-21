package engineer.arabski.task.dto;

public record FillInTheBlankTaskData(

        String description,
        String translatedSentence,
        String answer,
        String sentenceWithBlank

) implements TaskData {

    @Override
    public String type() {
        return "fill-in-the-blank";
    }

}
