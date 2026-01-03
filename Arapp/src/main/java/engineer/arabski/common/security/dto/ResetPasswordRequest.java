package engineer.arabski.common.security.dto;

public record ResetPasswordRequest(
        String token,
        String newPassword
) {
}
