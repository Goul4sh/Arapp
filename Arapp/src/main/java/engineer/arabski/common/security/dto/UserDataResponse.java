package engineer.arabski.common.security.dto;

public record UserDataResponse(Long user_id, String username, String email, String role) {
}
