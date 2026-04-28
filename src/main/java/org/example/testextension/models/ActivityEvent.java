package org.example.testextension.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Data
@Table(name = "activity_event")
public class ActivityEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_event;

    @Column(name = "event_type")
    private String event_type;

    @Column(name = "event_time")
    private LocalDateTime event_time;

    @ManyToOne()
    @JoinColumn(name = "id_attempt", nullable = false)
    @JsonIgnore()
    private TestAttempt testAttempt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "event_data", columnDefinition = "jsonb")
    private Map<String, Object> eventData;

}
