package org.example.testextension.controllers;

import org.example.testextension.dto.*;
import org.example.testextension.services.RegisterService;
import org.example.testextension.services.PersonService;
import org.example.testextension.security.JwtTokenProvider;
import org.example.testextension.models.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final RegisterService registerService;
    private final PersonService personService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;


    @Autowired
    public AuthController(RegisterService registerService,
                          PersonService personService,
                          AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider) {
        this.registerService = registerService;
        this.personService = personService;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Email is required", 400));
            }

            Person registeredPerson = registerService.register(registerRequest);

            return ResponseEntity.ok(new MessageResponse("User registered successfully"));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage(), 400));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("=== LOGIN ATTEMPT ===");
            System.out.println("Email: " + loginRequest.getEmail());
            System.out.println("Password: " + loginRequest.getPassword());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            Person person = personService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("Login successful for: " + person.getEmail());
            System.out.println("User role: " + person.getRole());

            JwtResponse response = new JwtResponse(jwt, loginRequest.getEmail(), person.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("=== LOGIN FAILED ===");
            System.out.println("Error type: " + e.getClass().getName());
            System.out.println("Error message: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid email or password", 401));
        }
    }
}