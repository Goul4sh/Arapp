package engineer.arabski.common.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RedisAuthService {

    private final StringRedisTemplate redisTemplate;

    private static final String EMAIL_VERIFICATION_PREFIX = "verify:";
    private static final String JWT_BLACKLIST_PREFIX = "jwt_blacklist:";
    private static final String USER_DETAILS_PREFIX = "user_details:";

    public void saveVerificationToken(String token, String email) {
        redisTemplate.opsForValue().set(
                EMAIL_VERIFICATION_PREFIX + token,
                email,
                24, TimeUnit.HOURS
        );
    }

    public String validateEmailVerificationToken(String token) {
        String key = EMAIL_VERIFICATION_PREFIX + token;
        String email = redisTemplate.opsForValue().get(key);

        if (email != null) {
            redisTemplate.delete(key);
            return email;
        }

        return null;
    }

    public void cacheUserDetails (String username, Collection<? extends GrantedAuthority> authorities) {
        String authString = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        redisTemplate.opsForValue().set(
                USER_DETAILS_PREFIX + username,
                authString,
                24, TimeUnit.HOURS
        );
    }
    public Collection<? extends GrantedAuthority> getCachedAuthorities(String username) {
        String key = USER_DETAILS_PREFIX + username;
        String authString = redisTemplate.opsForValue().get(key);

        if (authString == null) {
            return null;
        }

        return Arrays.stream(authString.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public void invalidateUserCache(String username) {
        redisTemplate.delete(USER_DETAILS_PREFIX + username);
    }


    public void addToBlacklist(String token, long ttlInMillis) {
        if (ttlInMillis > 0) {
            redisTemplate.opsForValue().set(
                    JWT_BLACKLIST_PREFIX + token,
                    "true",
                    ttlInMillis,
                    TimeUnit.MILLISECONDS
            );
        }
    }

    public boolean isBlacklisted(String token) {
        String value = redisTemplate.opsForValue().get(JWT_BLACKLIST_PREFIX + token);
        return value != null;
    }

    private static final String RESET_PASS_PREFIX = "reset_pass:";

    public void saveResetPasswordToken(String token, String email) {
        redisTemplate.opsForValue().set(
                RESET_PASS_PREFIX + token,
                email,
                15, TimeUnit.MINUTES
        );
    }

    public String validateResetPasswordToken(String token) {
        String key = RESET_PASS_PREFIX + token;
        String email = redisTemplate.opsForValue().get(key);

        if (email != null) {
            redisTemplate.delete(key);
            return email;
        }
        return null;
    }


}
