package engineer.arabski.statistics.repository;

import engineer.arabski.statistics.model.GlobalUserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalUserStatsRepository extends JpaRepository<GlobalUserStats, Long> {
}
