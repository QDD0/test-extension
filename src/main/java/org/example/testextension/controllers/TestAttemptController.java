package org.example.testextension.controllers;

import org.example.testextension.enums.TypeStatus;
import org.example.testextension.models.*;
import org.example.testextension.repositories.AttemptAnswerRepository;
import org.example.testextension.repositories.PersonRepository;
import org.example.testextension.repositories.TestAttemptRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/attempt")
public class TestAttemptController {

    private static final Logger log = LoggerFactory.getLogger(TestAttemptController.class);

    private final TestAttemptRepository attemptRepository;
    private final PersonRepository personRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;

    @Autowired
    public TestAttemptController(TestAttemptRepository attemptRepository,
                                 PersonRepository personRepository,
                                 AttemptAnswerRepository attemptAnswerRepository) {
        this.attemptRepository = attemptRepository;
        this.personRepository = personRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
    }

    private String getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.debug("Principal class: {}", principal.getClass().getName());
        log.debug("Principal: {}", principal);

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            log.debug("Email from UserDetails: {}", email);
            return email;
        } else {
            log.debug("Principal as String: {}", principal.toString());
            return principal.toString();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody Map<String, Object> data) {
        try {
            Integer testId = (Integer) data.get("testId");
            Map<String, Object> answers = (Map<String, Object>) data.get("answers");

            Person currentUser = personRepository.findByEmail(getCurrentUserEmail())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            log.info("Submitting test for user: {}, testId: {}", currentUser.getEmail(), testId);

            List<TestAttempt> attempts = attemptRepository.findByTestIdAndPersonIdAndStatus(
                    testId.longValue(), currentUser.getId_person(), TypeStatus.IN_PROGRESS
            );

            TestAttempt attempt;

            if (attempts.isEmpty()) {
                log.error("No active attempt found for test {} and user {}", testId, currentUser.getEmail());
                throw new RuntimeException("Нет активной попытки для завершения");

            } else if (attempts.size() > 1) {
                log.warn("Found {} active attempts for test {} and user {}. Using first and cleaning others",
                        attempts.size(), testId, currentUser.getEmail());

                attempt = attempts.get(0);

                for (int i = 1; i < attempts.size(); i++) {
                    TestAttempt extraAttempt = attempts.get(i);
                    extraAttempt.setStatus(TypeStatus.BLOCKED);
                    attemptRepository.save(extraAttempt);
                    log.info("Marked extra attempt {} as ERROR", extraAttempt.getId_attempt());
                }

            } else {
                attempt = attempts.get(0);
                log.debug("Found single active attempt: {}", attempt.getId_attempt());
            }

            saveAnswers(answers, attempt, currentUser);

            attempt.setEnd_time(LocalDateTime.now());
            attempt.setStatus(TypeStatus.COMPLETED);
            attemptRepository.save(attempt);

            log.info("Test {} completed successfully for user {}", testId, currentUser.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Тест успешно завершен");
            response.put("attemptId", attempt.getId_attempt());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error submitting test: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/start/{testId}")
    public ResponseEntity<?> startAttempt(@PathVariable Long testId) {
        try {
            Person currentUser = personRepository.findByEmail(getCurrentUserEmail())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            log.info("Starting test {} for user {}", testId, currentUser.getEmail());

            List<TestAttempt> existingAttempts = attemptRepository.findByTestIdAndPersonIdAndStatus(
                    testId, currentUser.getId_person(), TypeStatus.IN_PROGRESS
            );

            for (TestAttempt old : existingAttempts) {
                old.setStatus(TypeStatus.BLOCKED);
                attemptRepository.save(old);
            }

            TestAttempt attempt = new TestAttempt();
            attempt.setStart_time(LocalDateTime.now());
            attempt.setStatus(TypeStatus.IN_PROGRESS);
            attempt.setPersonAttempt(currentUser);
            attempt.setTestAttempt(new Test(testId));

            TestAttempt savedAttempt = attemptRepository.save(attempt);
            log.info("Created new attempt {} for test {} and user {}",
                    savedAttempt.getId_attempt(), testId, currentUser.getEmail());

            return ResponseEntity.ok(savedAttempt);

        } catch (Exception e) {
            log.error("Error starting test: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/finish/{attemptId}")
    public ResponseEntity<?> finishAttempt(@PathVariable Long attemptId) {
        try {
            TestAttempt attempt = attemptRepository.findById(attemptId)
                    .orElseThrow(() -> new RuntimeException("Попытка не найдена"));

            log.info("Finishing attempt {} for user {}", attemptId, attempt.getPersonAttempt().getEmail());

            attempt.setEnd_time(LocalDateTime.now());
            attempt.setStatus(TypeStatus.COMPLETED);

            TestAttempt finishedAttempt = attemptRepository.save(attempt);
            log.info("Attempt {} finished successfully", attemptId);

            return ResponseEntity.ok(finishedAttempt);

        } catch (Exception e) {
            log.error("Error finishing attempt: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/save-progress/{attemptId}")
    public ResponseEntity<?> saveProgress(@PathVariable Long attemptId,
                                          @RequestBody Map<String, Object> answers) {
        log.info("SAVE PROGRESS");
        log.info("Attempt ID: {}", attemptId);
        log.info("Received answers: {}", answers);

        TestAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Попытка не найдена"));

        for (Map.Entry<String, Object> entry : answers.entrySet()) {
            Long questionId = Long.valueOf(entry.getKey());
            Object answerValue = entry.getValue();

            log.debug("Updating question {} with value: {}", questionId, answerValue);

            int deletedCount = attemptAnswerRepository.findByTestAttemptAndQuestionId(attempt, questionId).size();
            attemptAnswerRepository.deleteByTestAttemptAndMainQuestion_Id(attempt, questionId);
            log.debug("Deleted {} old answers for question {}", deletedCount, questionId);

            saveAnswerForQuestion(questionId, answerValue, attempt);
        }

        List<AttemptAnswer> allAnswers = attemptAnswerRepository.findByTestAttempt(attempt);
        log.info("Total answers after save: {}", allAnswers.size());

        return ResponseEntity.ok(Map.of(
                "message", "Прогресс сохранен",
                "savedQuestions", answers.size(),
                "totalAnswers", allAnswers.size()
        ));
    }

    private void saveAnswerForQuestion(Long questionId, Object answerValue, TestAttempt attempt) {
        if (answerValue instanceof Integer) {
            AttemptAnswer aa = new AttemptAnswer();
            aa.setTestAttempt(attempt);
            aa.setMainQuestion(new Question(questionId));
            aa.setMainAnswer(new Answer(((Integer) answerValue).longValue()));
            aa.setAnswered_at(LocalDateTime.now());
            attemptAnswerRepository.save(aa);
            log.debug("Saved SINGLE answer: question={}, answer={}", questionId, answerValue);

        } else if (answerValue instanceof List) {
            List<?> list = (List<?>) answerValue;
            for (Object ansObj : list) {
                if (ansObj instanceof Integer) {
                    AttemptAnswer aa = new AttemptAnswer();
                    aa.setTestAttempt(attempt);
                    aa.setMainQuestion(new Question(questionId));
                    aa.setMainAnswer(new Answer(((Integer) ansObj).longValue()));
                    aa.setAnswered_at(LocalDateTime.now());
                    attemptAnswerRepository.save(aa);
                }
            }
            log.debug("Saved MULTIPLE answers: question={}, answers={}", questionId, list);

        } else if (answerValue instanceof String) {
            String textValue = (String) answerValue;
            if (textValue != null && !textValue.trim().isEmpty()) {
                AttemptAnswer aa = new AttemptAnswer();
                aa.setTestAttempt(attempt);
                aa.setMainQuestion(new Question(questionId));
                aa.setText_answer(textValue);
                aa.setAnswered_at(LocalDateTime.now());
                attemptAnswerRepository.save(aa);
                log.debug("Saved TEXT answer: question={}, text='{}'", questionId, textValue);
            } else {
                log.warn("Skipping empty TEXT answer for question {}", questionId);
            }
        }
    }

    private void saveAnswers(Map<String, Object> answers, TestAttempt attempt, Person currentUser) {
        if (answers == null || answers.isEmpty()) {
            log.debug("No answers to save for attempt {}", attempt.getId_attempt());
            return;
        }

        int answerCount = 0;
        log.info("Saving answers for attempt {}: {}", attempt.getId_attempt(), answers.keySet());

        for (Map.Entry<String, Object> entry : answers.entrySet()) {
            Long questionId = Long.valueOf(entry.getKey());
            Object answerValue = entry.getValue();

            log.debug("Processing question {} with value type: {}",
                    questionId,
                    answerValue != null ? answerValue.getClass().getSimpleName() : "null");
            log.debug("Value: {}", answerValue);

            if (answerValue instanceof Integer) {
                AttemptAnswer aa = new AttemptAnswer();
                aa.setTestAttempt(attempt);
                aa.setMainQuestion(new Question(questionId));
                aa.setText_answer(null);
                aa.setMainAnswer(new Answer(((Integer) answerValue).longValue()));
                aa.setAnswered_at(LocalDateTime.now());
                attemptAnswerRepository.save(aa);
                answerCount++;
                log.debug("Saved SINGLE answer for question {}", questionId);

            } else if (answerValue instanceof List) {
                List<?> list = (List<?>) answerValue;
                for (Object ansObj : list) {
                    if (ansObj instanceof Integer) {
                        AttemptAnswer aa = new AttemptAnswer();
                        aa.setTestAttempt(attempt);
                        aa.setMainQuestion(new Question(questionId));
                        aa.setText_answer(null);
                        aa.setMainAnswer(new Answer(((Integer) ansObj).longValue()));
                        aa.setAnswered_at(LocalDateTime.now());
                        attemptAnswerRepository.save(aa);
                        answerCount++;
                    }
                }
                log.debug("Saved MULTIPLE answers for question {}: {} answers", questionId, list.size());

            } else if (answerValue instanceof String) {
                String textAnswer = (String) answerValue;
                if (textAnswer != null && !textAnswer.trim().isEmpty()) {
                    AttemptAnswer aa = new AttemptAnswer();
                    aa.setTestAttempt(attempt);
                    aa.setMainQuestion(new Question(questionId));
                    aa.setText_answer(textAnswer);
                    aa.setMainAnswer(null);
                    aa.setAnswered_at(LocalDateTime.now());
                    attemptAnswerRepository.save(aa);
                    answerCount++;
                    log.debug("Saved TEXT answer for question {}: '{}'", questionId, textAnswer);
                } else {
                    log.warn("Skipping empty text answer for question {}", questionId);
                }
            } else {
                log.warn("Unknown answer type for question {}: {}", questionId, answerValue);
            }
        }
        log.info("Total saved {} answers for attempt {}", answerCount, attempt.getId_attempt());
    }

    @GetMapping("/result/{attemptId}")
    public ResponseEntity<?> getFullResult(@PathVariable Long attemptId) {
        try {
            log.info("Getting result for attempt: {}", attemptId);

            TestAttempt attempt = attemptRepository.findById(attemptId)
                    .orElseThrow(() -> new RuntimeException("Попытка не найдена"));

            List<AttemptAnswer> attemptAnswers = attemptAnswerRepository.findByTestAttempt(attempt);

            if (attemptAnswers.isEmpty()) {
                log.warn("No answers found for attempt: {}", attemptId);
                return ResponseEntity.ok(Map.of(
                        "score", 0,
                        "totalPoints", 0,
                        "percentage", 0,
                        "questions", new ArrayList<>(),
                        "message", "Нет сохраненных ответов"
                ));
            }

            int totalPoints = 0;
            int score = 0;
            List<Map<String, Object>> questionResults = new ArrayList<>();

            Map<Long, List<AttemptAnswer>> grouped = attemptAnswers.stream()
                    .collect(Collectors.groupingBy(a -> a.getMainQuestion().getId_question()));

            for (Map.Entry<Long, List<AttemptAnswer>> entry : grouped.entrySet()) {
                List<AttemptAnswer> userAnswers = entry.getValue();

                if (userAnswers == null || userAnswers.isEmpty()) {
                    log.warn("Empty user answers for question: {}", entry.getKey());
                    continue;
                }

                Question question = userAnswers.get(0).getMainQuestion();
                if (question == null) {
                    log.warn("Question is null for answer group: {}", entry.getKey());
                    continue;
                }

                totalPoints += question.getPoints();

                List<Answer> correctAnswers = question.getAnswers().stream()
                        .filter(Answer::getIs_correct)
                        .toList();

                boolean isCorrect = false;

                try {
                    if ("SINGLE".equals(question.getType_question().name())) {
                        if (userAnswers.get(0) != null && userAnswers.get(0).getMainAnswer() != null) {
                            isCorrect = userAnswers.get(0).getMainAnswer().getIs_correct();
                        } else {
                            log.warn("No answer found for SINGLE question: {}", question.getId_question());
                        }
                    } else if ("MULTIPLE".equals(question.getType_question().name())) {
                        if (!userAnswers.isEmpty() && !correctAnswers.isEmpty()) {
                            List<Long> userIds = userAnswers.stream()
                                    .filter(a -> a != null && a.getMainAnswer() != null)
                                    .map(a -> a.getMainAnswer().getId_answer())
                                    .collect(Collectors.toList());

                            List<Long> correctIds = correctAnswers.stream()
                                    .map(Answer::getId_answer)
                                    .collect(Collectors.toList());

                            isCorrect = userIds.containsAll(correctIds) && correctIds.containsAll(userIds);
                        } else {
                            log.warn("No answers or correct answers for MULTIPLE question: {}", question.getId_question());
                        }
                    } else if ("TEXT".equals(question.getType_question().name())) {
                        if (userAnswers.get(0) != null && !correctAnswers.isEmpty()) {
                            String userText = userAnswers.get(0).getText_answer();
                            String correctText = correctAnswers.get(0).getAnswer_text();
                            isCorrect = userText != null && correctText != null && userText.equalsIgnoreCase(correctText);
                        } else {
                            log.warn("No text answer or correct answer for TEXT question: {}", question.getId_question());
                        }
                    }
                } catch (Exception e) {
                    log.error("Error processing question {}: {}", question.getId_question(), e.getMessage());
                }

                if (isCorrect) {
                    score += question.getPoints();
                }

                Map<String, Object> qResult = new HashMap<>();
                qResult.put("questionId", question.getId_question());
                qResult.put("questionText", question.getQuestion_text());
                qResult.put("correct", isCorrect);

                List<String> userAnswerTexts = userAnswers.stream()
                        .map(a -> {
                            if (a == null) return "Нет ответа";
                            if (a.getMainAnswer() != null) return a.getMainAnswer().getAnswer_text();
                            if (a.getText_answer() != null) return a.getText_answer();
                            return "Нет ответа";
                        })
                        .collect(Collectors.toList());
                qResult.put("userAnswer", userAnswerTexts);

                List<String> correctAnswerTexts = correctAnswers.stream()
                        .map(Answer::getAnswer_text)
                        .collect(Collectors.toList());
                qResult.put("correctAnswers", correctAnswerTexts.isEmpty() ? List.of("Нет правильного ответа") : correctAnswerTexts);

                questionResults.add(qResult);
            }

            int percentage = totalPoints == 0 ? 0 : (score * 100 / totalPoints);

            Map<String, Object> response = Map.of(
                    "score", score,
                    "totalPoints", totalPoints,
                    "percentage", percentage,
                    "questions", questionResults
            );

            log.info("Result calculated: score={}, totalPoints={}, percentage={}", score, totalPoints, percentage);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting result for attempt {}: {}", attemptId, e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Ошибка при получении результатов: " + e.getMessage()));
        }
    }

    @GetMapping("/progress/{attemptId}")
    public ResponseEntity<?> getProgress(@PathVariable Long attemptId) {
        TestAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Попытка не найдена"));

        List<AttemptAnswer> answers = attemptAnswerRepository.findByTestAttempt(attempt);

        log.info("Loading progress for attempt {}, found {} answers", attemptId, answers.size());

        Map<Long, Object> result = new HashMap<>();

        Map<Long, List<AttemptAnswer>> groupedAnswers = answers.stream()
                .collect(Collectors.groupingBy(a -> a.getMainQuestion().getId_question()));

        for (Map.Entry<Long, List<AttemptAnswer>> entry : groupedAnswers.entrySet()) {
            Long questionId = entry.getKey();
            List<AttemptAnswer> questionAnswers = entry.getValue();

            if (questionAnswers.isEmpty()) continue;

            Question question = questionAnswers.get(0).getMainQuestion();
            String questionType = question.getType_question().name();

            log.debug("Processing question {} of type {}", questionId, questionType);

            if ("MULTIPLE".equals(questionType)) {
                List<Long> answerIds = questionAnswers.stream()
                        .filter(a -> a.getMainAnswer() != null)
                        .map(a -> a.getMainAnswer().getId_answer())
                        .collect(Collectors.toList());
                result.put(questionId, answerIds);
                log.debug("Restored MULTIPLE answer for question {}: {}", questionId, answerIds);

            } else if ("SINGLE".equals(questionType)) {
                AttemptAnswer firstAnswer = questionAnswers.get(0);
                if (firstAnswer.getMainAnswer() != null) {
                    result.put(questionId, firstAnswer.getMainAnswer().getId_answer());
                    log.debug("Restored SINGLE answer for question {}: {}",
                            questionId, firstAnswer.getMainAnswer().getId_answer());
                }

            } else if ("TEXT".equals(questionType)) {
                AttemptAnswer firstAnswer = questionAnswers.get(0);
                if (firstAnswer.getText_answer() != null) {
                    result.put(questionId, firstAnswer.getText_answer());
                    log.debug("Restored TEXT answer for question {}: '{}'",
                            questionId, firstAnswer.getText_answer());
                }
            }
        }

        log.info("Restored progress: {} questions with answers", result.size());
        log.debug("Progress data: {}", result);

        return ResponseEntity.ok(result);
    }
}