package org.example.testextension.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "violation")
public class Violation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_violation")
    private Long idViolation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_attempt", nullable = false)
    @JsonIgnore
    private TestAttempt testAttempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_event")
    @JsonIgnore
    private ActivityEvent activityEvent;

    @Column(name = "violation_type", length = 50)
    private String violationType;

    @Column(name = "severity")
    private Integer severity;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}