package org.example.testextension.services;

import org.example.testextension.models.Question;
import org.example.testextension.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getQuestionsByTest(Long id_test) {
        return questionRepository.findByTestIdTest(id_test);
    }
}