package engineer.arabski.statistics.model;

import engineer.arabski.lesson.model.Lesson;
import engineer.arabski.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private Long completedTasks;
    private Long correctAnswers;
    private Long incorrectAnswers;
    private Long durationSeconds;

    public UserStats(Long completedTasks, Long correctAnswers, Long incorrectAnswers, Long durationSeconds, User user) {

        this.completedTasks = completedTasks;
        this.correctAnswers = correctAnswers;
        this.incorrectAnswers = incorrectAnswers;
        this.durationSeconds = durationSeconds;
        this.user = user;

    }

    @ManyToOne(optional = true)
    private Lesson lesson;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
