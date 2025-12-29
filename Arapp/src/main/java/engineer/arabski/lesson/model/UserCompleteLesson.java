package engineer.arabski.lesson.model;

import engineer.arabski.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "completed_lessons", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "lesson_id"}) // User nie może ukończyć tej samej lekcji 2 razy
})
@Getter
@Setter
@NoArgsConstructor
public class UserCompleteLesson {


    public UserCompleteLesson(User user, Lesson lesson) {
        this.user = user;
        this.lesson = lesson;

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

//    private LocalDateTime completedAt;

}
