package engineer.arabski.statistics.model;

import engineer.arabski.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GlobalUserStats {

    @Id
    @Column(name = "user_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private Long totalTasksCompleted = 0L;
    private Long totalCorrectAnswers = 0L;
    private Long totalIncorrectAnswers = 0L;
    private Long totalDurationSeconds = 0L;

    private int currentStreak = 0;
    private LocalDate lastActivityDate;

}
