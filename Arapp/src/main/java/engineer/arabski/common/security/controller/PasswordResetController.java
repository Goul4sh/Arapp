package engineer.arabski.common.security.controller;

import engineer.arabski.common.security.dto.ForgotPasswordRequest;
import engineer.arabski.common.security.dto.ResetPasswordRequest;
import engineer.arabski.common.security.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        passwordResetService.initiatePasswordReset(forgotPasswordRequest);
        return ResponseEntity.status(HttpStatus.OK).body("Jeśli konto istnieje, na podany adres e-mail został wysłany link do zresetowania hasła.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        passwordResetService.resetPassword(resetPasswordRequest);
        return ResponseEntity.status(HttpStatus.OK).body("Hasło zostało pomyślnie zresetowane.");
    }

}
