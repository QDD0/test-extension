package org.example.testextension.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.example.testextension.enums.TypeStatus;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "test_attempt")
public class TestAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_attempt;

    @Column(name = "start_time")
    private LocalDateTime start_time;

    @Column(name = "end_time")
    private LocalDateTime end_time;

    @Column(name = "score")
    private Integer score;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TypeStatus status;

    @ManyToOne()
    @JoinColumn(name = "id_person")
    @JsonIgnore
    private Person personAttempt;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "id_test")
    private Test testAttempt;
}
