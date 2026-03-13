package org.example.testextension.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "attempt_answer")
public class AttemptAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_attempt_answer;

    @Column(name = "text_answer")
    private String text_answer;

    @Column(name = "answered_at")
    private LocalDateTime answered_at;

    @ManyToOne()
    @JsonIgnore()
    @JoinColumn(name = "id_attempt")
    private TestAttempt testAttempt;

    @ManyToOne()
    @JsonIgnore()
    @JoinColumn(name = "id_question")
    private Question mainQuestion;

    @ManyToOne()
    @JsonIgnore()
    @JoinColumn(name = "id_answer")
    private Answer mainAnswer;
}
