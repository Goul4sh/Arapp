package engineer.arabski.common.security.service;

import engineer.arabski.user.model.User;
import engineer.arabski.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {


    private final UserRepository userRepository;
    private final RedisAuthService redisAuthService;


    public String createToken(String email) {
        String token = UUID.randomUUID().toString();
        redisAuthService.saveVerificationToken(token, email);
        return token;
    }

    public Optional<User> verify(String token) {

        try {

            String email = redisAuthService.validateEmailVerificationToken(token);
            System.out.println("Znaleziono token: " + token + ". Zmienianie statusu użytkownika na aktywny.");
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            user.setEnabled(true);
            return Optional.of(user);

        } catch (Exception e) {
            System.err.println(e.getMessage());
            return Optional.empty();
        }
    }

}
