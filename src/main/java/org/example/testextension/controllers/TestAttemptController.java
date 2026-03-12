package org.example.testextension.controllers;

import org.example.testextension.enums.TypeStatus;
import org.example.testextension.models.*;
import org.example.testextension.repositories.AttemptAnswerRepository;
import org.example.testextension.repositories.PersonRepository;
import org.example.testextension.repositories.TestAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attempt")
public class TestAttemptController {
    private final TestAttemptRepository attemptRepository;
    private final PersonRepository personRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;

    @Autowired
    public TestAttemptController(TestAttemptRepository attemptRepository,
                                 PersonRepository personRepository,
                                 AttemptAnswerRepository attemptAnswerRepository) {
        this.attemptRepository = attemptRepository;
        this.personRepository = personRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
    }

    private String getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("Principal class: " + principal.getClass().getName());
        System.out.println("Principal: " + principal);

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            System.out.println("Email from UserDetails: " + email);
            return email;
        } else {
            System.out.println("Principal as String: " + principal.toString());
            return principal.toString();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody Map<String, Object> data) {
        Integer testId = (Integer) data.get("testId");
        Map<String, Object> answers = (Map<String, Object>) data.get("answers");

        Person currentUser = personRepository.findByEmail(getCurrentUserEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));


        System.out.println("Using user: " + currentUser.getEmail());

        TestAttempt attempt = attemptRepository.findByTestIdAndPersonIdAndStatus(
                testId.longValue(), currentUser.getId_person(), TypeStatus.IN_PROGRESS
        ).orElseThrow(() -> new RuntimeException("Нет активной попытки"));

        for (Map.Entry<String, Object> entry : answers.entrySet()) {
            Long questionId = Long.valueOf(entry.getKey());
            Object answerValue = entry.getValue();

            if (answerValue instanceof Integer) {
                AttemptAnswer aa = new AttemptAnswer();
                aa.setTestAttempt(attempt);
                aa.setMainQuestion(new Question(questionId));
                aa.setText_answer(null);
                aa.setMainAnswer(new Answer(((Integer) answerValue).longValue()));
                aa.setAnswered_at(LocalDateTime.now());
                attemptAnswerRepository.save(aa);

            } else if (answerValue instanceof List) {
                List<Integer> list = (List<Integer>) answerValue;
                for (Integer ansId : list) {
                    AttemptAnswer aa = new AttemptAnswer();
                    aa.setTestAttempt(attempt);
                    aa.setMainQuestion(new Question(questionId));
                    aa.setText_answer(null);
                    aa.setMainAnswer(new Answer(ansId.longValue()));
                    aa.setAnswered_at(LocalDateTime.now());
                    attemptAnswerRepository.save(aa);
                }

            } else if (answerValue instanceof String) {
                AttemptAnswer aa = new AttemptAnswer();
                aa.setTestAttempt(attempt);
                aa.setMainQuestion(new Question(questionId));
                aa.setText_answer((String) answerValue);
                aa.setAnswered_at(LocalDateTime.now());
                attemptAnswerRepository.save(aa);
            }
        }

        attempt.setEnd_time(LocalDateTime.now());
        attempt.setStatus(TypeStatus.COMPLETED);
        attemptRepository.save(attempt);

        return ResponseEntity.ok(Map.of("message", "Answers received"));
    }

    @PostMapping("/start/{testId}")
    public TestAttempt startAttempt(@PathVariable Long testId) {
        Person currentUser = personRepository.findByEmail(getCurrentUserEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        TestAttempt attempt = new TestAttempt();
        attempt.setStart_time(LocalDateTime.now());
        attempt.setStatus(TypeStatus.IN_PROGRESS);
        attempt.setPersonAttempt(currentUser);
        attempt.setTestAttempt(new Test(testId));

        return attemptRepository.save(attempt);
    }

    @PostMapping("/finish/{attemptId}")
    public TestAttempt finishAttempt(@PathVariable Long attemptId) {
        TestAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Попытка не найдена"));

        attempt.setEnd_time(LocalDateTime.now());
        attempt.setStatus(TypeStatus.COMPLETED);

        return attemptRepository.save(attempt);
    }
}