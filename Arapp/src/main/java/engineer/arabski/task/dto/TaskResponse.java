package engineer.arabski.task.dto;

public sealed interface TaskResponse permits ChooseOneTaskResponse {

    String type();
    String question();

}
