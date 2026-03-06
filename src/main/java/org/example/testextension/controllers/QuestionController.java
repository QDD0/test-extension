package org.example.testextension.controllers;

import org.example.testextension.models.Question;
import org.example.testextension.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/start-test")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/{id_test}")
    public List<Question> getQuestionsByTest(@PathVariable Long id_test) {
        return questionService.getQuestionsByTest(id_test);
    }
}