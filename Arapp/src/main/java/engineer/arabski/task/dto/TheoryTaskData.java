package engineer.arabski.task.dto;

public record TheoryTaskData(

        String description,
        String content,
        Long compendiumEntryId

) implements TaskData {
    @Override
    public String type() {
        return "theory";
    }
}
