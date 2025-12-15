package engineer.arabski.statistics.dto;

public record UserStatsRequest (

        Long completedTasks,
        Long correctAnswers,
        Long incorrectAnswers,
        Long durationSeconds


) {
}
