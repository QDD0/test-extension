package org.example.testextension.services;

import jakarta.transaction.Transactional;
import org.example.testextension.dto.RegisterRequest;
import org.example.testextension.enums.Role;
import org.example.testextension.models.Person;
import org.example.testextension.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {
    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RegisterService(PersonRepository personRepository, PasswordEncoder passwordEncoder) {
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Person register(RegisterRequest request) {
        if (personRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Person person = new Person();
        person.setEmail(request.getEmail());
        person.setFirst_name(request.getFirst_name());
        person.setLast_name(request.getLast_name());
        person.setSurname(request.getSurname());
        person.setRole(Role.ROLE_USER);
        person.setPassword(passwordEncoder.encode(request.getPassword()));

        return personRepository.save(person);
    }
}