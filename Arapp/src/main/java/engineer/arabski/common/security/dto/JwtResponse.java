package engineer.arabski.common.security.dto;

public record JwtResponse(String jwt, Long user_id, String role) {
}
