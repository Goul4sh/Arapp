package engineer.arabski.statistics.dto;

public interface UserStatsAggregation {
    Long getCompletedTasks();
    Long getCorrectAnswers();
    Long getIncorrectAnswers();
    Long getDurationSeconds();
}
