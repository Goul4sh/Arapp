package engineer.arabski.task.dto;


import com.fasterxml.jackson.annotation.JsonGetter;
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
        @JsonSubTypes.Type(value = FillInTheBlankTaskData.class, name = "fill-in-the-blank"),
        @JsonSubTypes.Type(value = MatchPairsTaskData.class, name = "match-pairs"),
        @JsonSubTypes.Type(value = TheoryTaskData.class, name = "theory"),
        @JsonSubTypes.Type(value = MorphologyFormTaskData.class, name = "morphology-form"),
        @JsonSubTypes.Type(value = MorphologyPartsTaskData.class, name = "morphology-parts"),
        @JsonSubTypes.Type(value = AssistedWritingTaskData.class, name = "writing-assisted"),
        @JsonSubTypes.Type(value = TranslateTaskData.class, name = "translate")

//TODO naprawić widocznosc type na froncie
})

public sealed interface TaskData
        permits AssistedWritingTaskData, ChooseOneTaskData, FillInTheBlankTaskData, MatchPairsTaskData, MorphologyFormTaskData, MorphologyPartsTaskData, MultipleChoiceTaskData, TheoryTaskData, TranslateTaskData {

    String type();

    String description();

}
