package org.example.testextension.repositories;

import org.example.testextension.models.AttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {
}
