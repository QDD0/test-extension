package org.example.testextension.controllers;

import org.example.testextension.models.AttemptAnswer;
import org.example.testextension.repositories.AttemptAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/attempt-answer")
public class AttemptAnswerController {
    private final AttemptAnswerRepository attemptAnswerRepository;

    @Autowired
    public AttemptAnswerController(AttemptAnswerRepository attemptAnswerRepository) {
        this.attemptAnswerRepository = attemptAnswerRepository;
    }

    @PostMapping("/save")
    public AttemptAnswer saveAnswer(@RequestBody AttemptAnswer attemptAnswer) {
        attemptAnswer.setAnswered_at(LocalDateTime.now());

        return attemptAnswerRepository.save(attemptAnswer);
    }
}
