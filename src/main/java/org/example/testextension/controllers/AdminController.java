package org.example.testextension.controllers;

import org.example.testextension.models.*;
import org.example.testextension.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final PersonRepository personRepository;
    private final TestAttemptRepository attemptRepository;
    private final ActivityEventRepository activityEventRepository;

    public AdminController(PersonRepository personRepository,
                           TestAttemptRepository attemptRepository,
                           ActivityEventRepository activityEventRepository) {
        this.personRepository = personRepository;
        this.attemptRepository = attemptRepository;
        this.activityEventRepository = activityEventRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<Person>> getAllUsers() {
        return ResponseEntity.ok(personRepository.findAll());
    }

    @GetMapping("/user/{userId}/attempts")
    public ResponseEntity<?> getUserAttempts(@PathVariable Long userId) {
        if (!personRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }

        List<TestAttempt> attempts = attemptRepository.findAttemptsByUserId(userId);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/attempt/{attemptId}/events")
    public ResponseEntity<?> getAttemptEvents(@PathVariable Long attemptId) {
        if (!attemptRepository.existsById(attemptId)) {
            return ResponseEntity.notFound().build();
        }

        List<ActivityEvent> events = activityEventRepository.findEventsByAttemptId(attemptId);
        return ResponseEntity.ok(events);
    }
}