package engineer.arabski.common.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisAuthService {

    private final StringRedisTemplate redisTemplate;

    private static final String EMAIL_VERIFICATION_PREFIX = "verify_email:";
    private static final String JWT_BLACKLIST_PREFIX = "jwt_blacklist:";

    public void saveVerificationToken(String token, String email) {
        redisTemplate.opsForValue().set(
                "verify:" + token,
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

}
