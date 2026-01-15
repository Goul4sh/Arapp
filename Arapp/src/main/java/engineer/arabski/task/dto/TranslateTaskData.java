package engineer.arabski.task.dto;

public record TranslateTaskData(

        String description,
        String textToTranslate,
        String translatedText


) implements TaskData {
    @Override
    public String type() {
        return "translate";
    }

}
