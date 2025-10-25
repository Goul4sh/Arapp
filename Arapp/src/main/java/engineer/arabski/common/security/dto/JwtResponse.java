package engineer.arabski.common.security.dto;

public record JwtResponse(String token, Long user_id, String role) {
}
