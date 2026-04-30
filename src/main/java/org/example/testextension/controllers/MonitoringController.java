package org.example.testextension.controllers;

import org.example.testextension.dto.ViolationRequest;
import org.example.testextension.services.MonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    @Autowired
    private MonitoringService monitoringService;

    @PostMapping("/violation")
    public ResponseEntity<?> handleViolation(@RequestBody ViolationRequest request) {

        monitoringService.processViolation(
                request.getAttemptId(),
                request.getEventType(),
                request.getEventData()
        );
        return ResponseEntity.ok().build();
    }
}