package engineer.arabski.common.security.service;

import engineer.arabski.common.security.dto.ForgotPasswordRequest;
import engineer.arabski.common.security.dto.ResetPasswordRequest;
import engineer.arabski.user.model.User;
import engineer.arabski.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final EmailService emailService;
    private final RedisAuthService redisAuthService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public void initiatePasswordReset(ForgotPasswordRequest request) {

        userRepository.findByEmail(request.email()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();

            redisAuthService.saveResetPasswordToken(resetToken, user.getEmail());

            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {

        String email = redisAuthService.validateResetPasswordToken(request.token());

        if (email == null) {
            throw new IllegalArgumentException("Nieprawidłowy lub wygasły token");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Użytkownik nie znaleziony"));

        user.setPassword(passwordEncoder.encode(request.newPassword()));

        userRepository.save(user);
    }

}






