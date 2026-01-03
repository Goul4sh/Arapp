package engineer.arabski.common.security.controller;

import engineer.arabski.common.security.CustomUserDetails;
import engineer.arabski.common.security.EmailVerificationToken;
import engineer.arabski.common.security.dto.ErrorResponse;
import engineer.arabski.common.security.dto.UserDataResponse;
import engineer.arabski.common.security.dto.LoginRequest;
import engineer.arabski.common.security.dto.RegisterRequest;
import engineer.arabski.common.security.exception.UserAlreadyExistsException;
import engineer.arabski.common.security.service.EmailService;
import engineer.arabski.common.security.service.EmailVerificationService;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        if (loginRequest.email() == null || loginRequest.password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
        }

        try {

            String jwt = userService.authenticateUser(loginRequest.email(), loginRequest.password());
            User user = userService.getUserByEmail(loginRequest.email()).orElseThrow();


            ResponseCookie jwtCookie = ResponseCookie.from("jwt", jwt)
                    .httpOnly(true)
                    .secure(false) //localhost
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .sameSite("Strict")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(new UserDataResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name()));


        } catch (BadCredentialsException e) {
            System.out.println("Failed login attempt for email: " + loginRequest.email());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Nieprawidłowy e-mail lub hasło"));

        } catch (DisabledException e) {
            System.out.println("Konto nieaktywne");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Konto nieaktywne. Sprawdź skrzynkę mailową."));
        }

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
//        if (registerRequest.email() == null || registerRequest.password() == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
//        }

        try {
            User newUser = userService.createUser(registerRequest);

            EmailVerificationToken token = emailVerificationService.createToken(newUser);

            emailService.sendVerificationEmail(newUser, token.getToken());

            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (UserAlreadyExistsException e) {
            System.out.println("User already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Konto z tym adresem e-mail już istnieje."));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Wystąpił błąd serwera przy rejestracji."));
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


            ResponseCookie jwtCookie = ResponseCookie.from("jwt", "")
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(0)
                    .sameSite("Strict")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body("Logged out successfully");

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

                .location(URI.create(frontendUrl + "/api/auth/login"))
                .body("Email zweryfikowany pomyślnie. Możesz teraz zamknąć tę stronę.");
    }

}
