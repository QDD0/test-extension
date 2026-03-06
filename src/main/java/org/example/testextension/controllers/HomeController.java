package org.example.testextension.controllers;

import org.example.testextension.models.Test;
import org.example.testextension.services.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tests-page")
@CrossOrigin(origins = "http://localhost:4200")
public class HomeController {
    private final TestService testService;

    @Autowired
    public HomeController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping()
    public List<Test> allTests() {
        return testService.findAll();
    }
}
