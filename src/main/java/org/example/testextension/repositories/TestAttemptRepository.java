package org.example.testextension.repositories;

import org.example.testextension.dto.TestAttemptProjection;
import org.example.testextension.enums.TypeStatus;
import org.example.testextension.models.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {

    @Query("SELECT ta FROM TestAttempt ta WHERE ta.testAttempt.id_test = :testId AND ta.personAttempt.id_person = :personId AND ta.status = :status")
    List<TestAttempt> findByTestIdAndPersonIdAndStatus(
            @Param("testId") Long testId,
            @Param("personId") Long personId,
            @Param("status") TypeStatus status);

    @Query("SELECT ta.id_attempt as id_attempt, " +
            "ta.testAttempt.id_test as id_test, " +
            "ta.testAttempt.title as testTitle, " +
            "ta.start_time as start_time, " +
            "ta.end_time as end_time, " +
            "ta.score as score, " +
            "ta.percentage as percentage, " +
            "ta.total_points as total_points, " +
            "ta.status as status " +
            "FROM TestAttempt ta " +
            "WHERE ta.personAttempt.id_person = :userId")
    List<TestAttemptProjection> findAttemptsByUserId(@Param("userId") Long userId);
}