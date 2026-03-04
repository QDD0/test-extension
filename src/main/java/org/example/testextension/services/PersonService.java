package org.example.testextension.services;

import org.example.testextension.models.Person;
import org.example.testextension.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonService {
    private PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<Person> findAll() {
        return this.personRepository.findAll();
    }

    public Person findByEmail(String email) {
        return personRepository.findByEmail(email).orElse(null);
    }

    public Person findById(Long id) {
        return personRepository.findById(id).orElse(null);
    }
}
