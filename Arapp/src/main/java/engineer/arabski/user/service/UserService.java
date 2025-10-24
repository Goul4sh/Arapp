package engineer.arabski.user.service;

import engineer.arabski.common.security.jwt.JwtUtil;
import engineer.arabski.user.model.User;
import engineer.arabski.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;


@Service
public class UserService {

    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtTokenUtil;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    public String authenticateUser(String email, String password) {
        // Find user by email
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> jwtTokenUtil.generateToken(user.getEmail()))
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
    }


    public String processOAuthPostLogin(OAuth2User oAuth2User) {

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");

        userRepository.findByEmail(email).orElseGet(() -> {

            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(oAuth2User.getAttribute("name"));

            return userRepository.save(newUser);
        });
        return email;
    }

}
