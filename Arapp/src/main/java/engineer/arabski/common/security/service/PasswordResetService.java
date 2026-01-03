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
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void initiatePasswordReset(ForgotPasswordRequest request) {

        userRepository.findByEmail(request.email()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();

            user.setResetPasswordToken(resetToken);
            user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByResetPasswordToken(request.token())
                .orElseThrow(() -> new IllegalArgumentException("Nieprawidłowy lub nieistniejący token"));

        if (user.getResetPasswordTokenExpiry() == null ||
                user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token wygasł");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));

        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);

        userRepository.save(user);
    }

}






