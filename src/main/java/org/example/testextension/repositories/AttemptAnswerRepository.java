package org.example.testextension.repositories;

import jakarta.transaction.Transactional;
import org.example.testextension.models.AttemptAnswer;
import org.example.testextension.models.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {
    List<AttemptAnswer> findByTestAttempt(TestAttempt attempt);

    @Modifying
    @Transactional
    @Query("DELETE FROM AttemptAnswer a WHERE a.testAttempt = :attempt AND a.mainQuestion.id_question = :questionId")
    void deleteByTestAttemptAndMainQuestion_Id(TestAttempt attempt, Long questionId);

    @Query("SELECT a FROM AttemptAnswer a WHERE a.testAttempt = :attempt AND a.mainQuestion.id = :questionId")
    List<AttemptAnswer> findByTestAttemptAndQuestionId(TestAttempt attempt, Long questionId);
}
