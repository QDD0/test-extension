package org.example.testextension.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.testextension.enums.TypeQuestion;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_question;

    @Column(name = "question_text")
    private String question_text;

    @Column(name = "type_question")
    @Enumerated(EnumType.STRING)
    private TypeQuestion type_question;

    @Column(name = "points")
    private Integer points;

    @ManyToOne()
    @JoinColumn(name = "id_test")
    @JsonIgnore
    private Test test;

    @OneToMany(mappedBy = "questions", fetch = FetchType.EAGER)
    private List<Answer> answers;

    @OneToMany(mappedBy = "mainQuestion", fetch = FetchType.EAGER)
    private List<AttemptAnswer> questions;

    public Question(Long id_question) {
        this.id_question = id_question;
    }
}