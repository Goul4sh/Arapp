package engineer.arabski.statistics.dto;

import engineer.arabski.statistics.model.UserStats;

public record UserStatsResponse(

        Long completedTasks,
        Long correctAnswers,
        Long incorrectAnswers,
        Long durationSeconds

) {
    public static UserStatsResponse fromEntity(UserStats userStats) {
        return new UserStatsResponse(
                userStats.getCompletedTasks(),
                userStats.getCorrectAnswers(),
                userStats.getIncorrectAnswers(),
                userStats.getDurationSeconds()
        );
    }
}
