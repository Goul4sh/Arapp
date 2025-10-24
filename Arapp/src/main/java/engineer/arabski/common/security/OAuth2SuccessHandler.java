package engineer.arabski.common.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import engineer.arabski.common.security.jwt.JwtUtil;
import engineer.arabski.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();


    public OAuth2SuccessHandler(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String localUsername = userService.processOAuthPostLogin(oauthUser);

        String token = jwtUtil.generateTokenGoogle(localUsername);

        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        objectMapper.writeValue(response.getWriter(), Map.of("token", token, "type", "Bearer"));
    }
}
