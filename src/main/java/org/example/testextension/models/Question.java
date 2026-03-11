package org.example.testextension.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.example.testextension.enums.TypeQuestion;

import java.util.List;

@Data
@Entity
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
}