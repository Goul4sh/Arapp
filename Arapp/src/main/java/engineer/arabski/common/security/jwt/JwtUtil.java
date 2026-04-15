package engineer.arabski.common.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private static final long EXPIRATION_TIME = 86400000;

    private SecretKey signingKey;
    private JwtParser jwtParser;

    @PostConstruct
    private void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.jwtParser = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    public String generateTokenGoogle(String email) {
        return createToken(Map.of("provider", "google"), email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }

    public Boolean validateToken(String token, String username) {
        final String tokenUsername = extractUsername(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        } catch (Exception e) {
            System.err.println("Error extracting claims: " + e.getMessage());
            throw new RuntimeException("Failed to extract all claims" + e + " " + e.getMessage(), e);
        }

    }


    private Claims extractAllClaims(String token) {
        try {
            return jwtParser
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new RuntimeException("Failed to extract all claims" + e + " " + e.getMessage(), e);
        }
    }


    public long getExpirationTime(String token) {
        final Date expiration = extractExpiration(token);
        return expiration.getTime();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }


}
