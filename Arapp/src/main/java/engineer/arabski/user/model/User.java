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

    public User(RegisterRequest registerRequest) {
        this.email = registerRequest.email();
        System.out.println("Jestesmy w konstruktorze User");
        System.out.println("Przypisany mail to: " + this.email);
        this.username = registerRequest.username();
        // Set password from DTO so it's not null. Encoding should be done by the service.
        this.password = registerRequest.password();
        // Optionally set a default role if desired
        if (this.role == null) {
            this.role = "USER";
        }
    }

}
