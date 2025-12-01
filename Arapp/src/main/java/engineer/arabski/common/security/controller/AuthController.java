package engineer.arabski.common.security.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.common.security.EmailVerificationToken;
import engineer.arabski.common.security.dto.UserDataResponse;
import engineer.arabski.common.security.dto.LoginRequest;
import engineer.arabski.common.security.dto.RegisterRequest;
import engineer.arabski.common.security.service.EmailService;
import engineer.arabski.common.security.service.EmailVerificationService;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    public AuthController(UserService userService, EmailVerificationService emailVerificationService, EmailService emailService) {
        this.userService = userService;
        this.emailVerificationService = emailVerificationService;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        if (loginRequest.email() == null || loginRequest.password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
        }

        try {
            String jwt = userService.authenticateUser(loginRequest.email(), loginRequest.password());
            User user = userService.getUserByEmail(loginRequest.email()).get();

            if (!user.isEnabled()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email not verified");
            }

            Cookie cookie = new Cookie("jwt", jwt);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60);
            response.addCookie(cookie);


            return ResponseEntity.ok(new UserDataResponse(user.getId(), user.getUsername(), user.getEmail(), "USER"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (registerRequest.email() == null || registerRequest.password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
        }

        try {
            Optional<User> newUser = userService.createUser(registerRequest);

            if (newUser.isEmpty()) {
                throw new IllegalArgumentException("User registration failed");
            }

            EmailVerificationToken token = emailVerificationService.createToken(newUser.get());
            emailService.sendVerificationEmail(newUser.get(), token.getToken());

            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        try {
            SecurityContextHolder.clearContext();

            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }

            Cookie cookie = new Cookie("jwt", "");
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);

            // hmmmmmmm
            String header = "jwt=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None";
            response.addHeader("Set-Cookie", header);

            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {

            System.err.println("Error logging out: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed");
        }

    }


    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        var userDetails = (CustomUserDetails) authentication.getPrincipal();
        UserDataResponse userData = new UserDataResponse(
                userDetails.getId(),
                userDetails.getRealUsername(),
                userDetails.getUsername(),
                "USER"
        );

        System.out.println("Validated user: " + userDetails.getUsername());
        return ResponseEntity.ok(userData);


    }

    //TODO poprawic obsluge bledow, dodac przekierowania
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        System.out.println("Verifying email with token: " + token);

        try {
            Optional<User> user = emailVerificationService.verify(token);

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
            }

            User verifiedUser = user.get();
            verifiedUser.setEnabled(true);
            userService.saveUser(verifiedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .location(URI.create("http://localhost:5173/api/auth/login"))
                .body("Email zweryfikowany pomyślnie. Możesz teraz zamknąć tę stronę.");
    }

}
