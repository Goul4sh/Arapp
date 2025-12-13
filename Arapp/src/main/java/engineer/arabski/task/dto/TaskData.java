package engineer.arabski.task.dto;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

// Informacja dla Jacksona odnosnie serializacji i deseralizacji typow taskow

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type")

@JsonSubTypes({
        @JsonSubTypes.Type(value = ChooseOneTaskData.class, name = "choose-one"),
        @JsonSubTypes.Type(value = MultipleChoiceTaskData.class, name = "multiple-choice"),
        @JsonSubTypes.Type(value = FillInTheBlankTaskData.class, name = "fill-in-the-blank")

})

public sealed interface TaskData permits ChooseOneTaskData, MultipleChoiceTaskData, FillInTheBlankTaskData {

    String type();

    String description();

}
