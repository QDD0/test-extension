package org.example.testextension.services;

import org.example.testextension.dto.RegisterRequest;
import org.example.testextension.enums.Role;
import org.example.testextension.models.Person;
import org.example.testextension.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService {
    private PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<Person> findByAll() {
        return personRepository.findAll();
    }

    public Optional<Person> findByEmail(String email) {
        return personRepository.findByEmail(email);
    }

    public Person findById(Long id) {
        return personRepository.findById(id).orElse(null);
    }
}