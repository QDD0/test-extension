package org.example.testextension.repositories;

import org.example.testextension.models.AttemptAnswer;
import org.example.testextension.models.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {
    List<AttemptAnswer> findByTestAttempt(TestAttempt attempt);
}
