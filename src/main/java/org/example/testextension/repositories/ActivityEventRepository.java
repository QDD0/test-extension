package org.example.testextension.repositories;

import org.example.testextension.models.ActivityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityEventRepository extends JpaRepository<ActivityEvent,Long> {
    @Query("SELECT ae FROM ActivityEvent ae WHERE ae.testAttempt.id_attempt = :attemptId")
    List<ActivityEvent> findEventsByAttemptId(@Param("attemptId") Long attemptId);
}