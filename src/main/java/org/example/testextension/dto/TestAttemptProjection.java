package org.example.testextension.dto;

import org.example.testextension.enums.TypeStatus;
import java.time.LocalDateTime;

public interface TestAttemptProjection {
    Long getId_attempt();
    Long getId_test();
    String getTestTitle();
    LocalDateTime getStart_time();
    LocalDateTime getEnd_time();
    Integer getScore();
    Integer getPercentage();
    Integer getTotal_points();
    TypeStatus getStatus();
}