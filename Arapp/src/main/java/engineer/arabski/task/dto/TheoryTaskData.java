package engineer.arabski.task.dto;

public record TheoryTaskData(

        String description,
        String content

) implements TaskData {
    @Override
    public String type() {
        return "theory";
    }
}
