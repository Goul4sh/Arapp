package engineer.arabski.statistics.dto;


public record UserStatsResponse(

        Long completedTasks,
        Long correctAnswers,
        Long incorrectAnswers,
        Long durationSeconds,
        Long flashcardsReviewed

) {

}
