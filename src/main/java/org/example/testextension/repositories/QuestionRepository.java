package org.example.testextension.repositories;

import org.example.testextension.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("""
           SELECT q
           FROM Question q
           LEFT JOIN FETCH q.answers
           WHERE q.test.id_test = :id
           """)
    List<Question> findQuestionsWithAnswers(Long id);
}