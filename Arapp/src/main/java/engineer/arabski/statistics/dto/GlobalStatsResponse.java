package engineer.arabski.statistics.dto;

import java.util.List;

public record GlobalStatsResponse(

        Long totalCompletedTasks,
        Long totalCorrectAnswers,
        Long totalIncorrectAnswers,
        Long totalDurationSeconds,
        List<String> activityDates,
        Long currentStreak
) {
}
