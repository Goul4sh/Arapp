package engineer.arabski.user.model;

import engineer.arabski.common.security.dto.RegisterRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;
    private String username;
    private String password;


    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private boolean enabled = false;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expiry")
    private LocalDateTime resetPasswordTokenExpiry;

    public User(RegisterRequest registerRequest) {
        this.email = registerRequest.email();
        this.username = registerRequest.username();
        this.password = registerRequest.password();

    }

    public User(RegisterRequest registerRequest, String role) {
        this.email = registerRequest.email();
        this.username = registerRequest.username();
        this.password = registerRequest.password();

    }


}
