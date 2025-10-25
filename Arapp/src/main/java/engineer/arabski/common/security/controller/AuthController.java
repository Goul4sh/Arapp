package engineer.arabski.common.security.controller;

import engineer.arabski.common.security.dto.JwtResponse;
import engineer.arabski.common.security.dto.LoginRequest;
import engineer.arabski.common.security.dto.RegisterRequest;
import engineer.arabski.common.security.jwt.JwtUtil;
import engineer.arabski.user.model.User;
import engineer.arabski.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        if (loginRequest.email() == null || loginRequest.password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
        }

        try {
            String jwt = userService.authenticateUser(loginRequest.email(), loginRequest.password());
            User user = userService.getUserByEmail(loginRequest.email()).get();
            Long user_id = user.getId();

            return ResponseEntity.ok(new JwtResponse(jwt, user_id, "USER"));
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
            userService.createUser(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/test")
    public String test() {
        return "AuthController is working!";
    }



}
