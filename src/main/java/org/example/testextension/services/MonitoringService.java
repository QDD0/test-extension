package org.example.testextension.services;

import org.example.testextension.models.ActivityEvent;
import org.example.testextension.models.TestAttempt;
import org.example.testextension.models.Violation;
import org.example.testextension.repositories.ActivityEventRepository;
import org.example.testextension.repositories.TestAttemptRepository;
import org.example.testextension.repositories.ViolationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class MonitoringService {

    @Autowired
    private ActivityEventRepository activityEventRepository;

    @Autowired
    private ViolationRepository violationRepository;

    @Autowired
    private TestAttemptRepository testAttemptRepository;

    public void processViolation(Long attemptId, String eventType, Map<String, Object> eventData) {
        TestAttempt attempt = testAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        ActivityEvent event = new ActivityEvent();
        event.setTestAttempt(attempt);
        event.setEvent_type(eventType);
        event.setEvent_time(LocalDateTime.now());
        event.setEventData(eventData);

        activityEventRepository.save(event);

        if (isSeriousViolation(eventType)) {
            Violation violation = new Violation();
            violation.setTestAttempt(attempt);
            violation.setActivityEvent(event);
            violation.setViolationType(mapViolationType(eventType));
            violation.setSeverity(calculateSeverity(eventType));

            violationRepository.save(violation);
        }
    }

    private boolean isSeriousViolation(String eventType) {
        return List.of(
                "screenshotBlocked",
                "screenshotAttempt",
                "screenshotSuspicion",
                "screenshotPattern",
                "screenRecordingAttempt",
                "devToolsDetected",
                "devToolsViolation"
        ).contains(eventType);
    }

    private String mapViolationType(String eventType) {
        if (eventType == null) return "OTHER";

        return switch (eventType) {

            case "tabSwitchWarning",
                 "tabSwitch",
                 "TAB_SWITCH" -> "TAB_SWITCH";

            case "windowBlur",
                 "WINDOW_BLUR" -> "WINDOW_BLUR";

            case "copyAttempt",
                 "COPY_ATTEMPT" -> "COPY_ATTEMPT";

            case "screenshotAttempt",
                 "screenshotSuspicion",
                 "screenshotPattern",
                 "screenRecordingAttempt" -> "SCREENSHOT";

            case "devToolsDetected",
                 "devToolsViolation" -> "APP_CHANGE";

            default -> "OTHER";
        };
    }

    private Integer calculateSeverity(String eventType) {
        return switch (eventType) {
            case "screenRecordingAttempt" -> 10;
            case "screenshotAttempt" -> 9;
            case "screenshotSuspicion", "screenshotPattern" -> 7;
            case "devToolsDetected", "devToolsViolation" -> 10;
            case "tabSwitchWarning" -> 3;
            default -> 5;
        };
    }
}
