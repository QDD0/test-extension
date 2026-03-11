package org.example.testextension.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "answer")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_answer;

    @Column(name = "answer_text")
    private String answer_text;

    @Column(name = "is_correct")
    private Boolean is_correct;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_question")
    @JsonIgnore
    private Question questions;
}
