package engineer.arabski.common.security;

import engineer.arabski.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;

    private LocalDateTime expiryDate;

    @OneToOne(cascade = CascadeType.ALL)
    private User user;

}
