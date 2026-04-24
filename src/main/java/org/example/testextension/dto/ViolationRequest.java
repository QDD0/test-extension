package org.example.testextension.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ViolationRequest {
    private Long attemptId;
    private String eventType;
    private Map<String, Object> eventData;
}
