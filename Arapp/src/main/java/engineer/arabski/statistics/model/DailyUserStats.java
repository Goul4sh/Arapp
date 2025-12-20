package engineer.arabski.statistics.model;

import engineer.arabski.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "daily_statistics", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DailyUserStats {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    private Long dailyCompletedTasks = 0L;
    private Long dailyCorrectAnswers = 0L;
    private Long dailyIncorrectAnswers = 0L;
    private Long dailyLearningTime = 0L; // Czas w sekundach

}
