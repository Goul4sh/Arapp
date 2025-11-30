package engineer.arabski.user.model;

import engineer.arabski.common.security.dto.RegisterRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String role;

    // powiązane z aktywacją konta w mailu
    private boolean enabled = false;

    public User(RegisterRequest registerRequest) {
        this.email = registerRequest.email();
        this.username = registerRequest.username();
        this.password = registerRequest.password();
        if (this.role == null) {
            this.role = "USER";
        }
    }

}
