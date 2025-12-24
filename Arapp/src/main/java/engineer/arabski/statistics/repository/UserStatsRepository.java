package engineer.arabski.statistics.repository;

import engineer.arabski.statistics.dto.UserStatsAggregation;
import engineer.arabski.statistics.model.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Long> {

    @Query("SELECT " +
            "COALESCE(SUM(us.completedTasks), 0) as completedTasks, " +
            "COALESCE(SUM(us.correctAnswers), 0) as correctAnswers, " +
            "COALESCE(SUM(us.incorrectAnswers), 0) as incorrectAnswers, " +
            "COALESCE(SUM(us.durationSeconds), 0) as durationSeconds " +
            "FROM UserStats us WHERE us.user.id = :userId")
    UserStatsAggregation getAggregatedStatsByUserId(@Param("userId") Long userId);

}
