package org.example.testextension.repositories;

import org.example.testextension.enums.TypeStatus;
import org.example.testextension.models.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {

    @Query("SELECT ta FROM TestAttempt ta WHERE ta.testAttempt.id_test = :testId AND ta.personAttempt.id_person = :personId AND ta.status = :status")
    List<TestAttempt> findByTestIdAndPersonIdAndStatus(
            @Param("testId") Long testId,
            @Param("personId") Long personId,
            @Param("status") TypeStatus status);
}