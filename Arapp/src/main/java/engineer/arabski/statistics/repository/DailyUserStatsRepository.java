package engineer.arabski.statistics.repository;

import engineer.arabski.statistics.model.DailyUserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyUserStatsRepository extends JpaRepository<DailyUserStats, Long> {

    Optional<DailyUserStats> findByUserIdAndDate(Long userId, LocalDate date);

    @Query("SELECT d.date FROM DailyUserStats d WHERE d.user.id = :userId")
    List<LocalDate> findActivityDatesByUserId(@Param("userId") Long userId);

    @Query("SELECT d.date FROM DailyUserStats d WHERE d.user.id = :userId ORDER BY d.date DESC")
    List<LocalDate> findDatesForStreak(@Param("userId") Long userId);

}
