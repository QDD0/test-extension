package org.example.testextension.services;

import org.example.testextension.models.Person;
import org.example.testextension.repositories.PersonRepository;
import org.example.testextension.security.PersonDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PersonDetailsService implements UserDetailsService {

    private final PersonRepository personRepository;

    @Autowired
    public PersonDetailsService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("=== LOADING USER ===");
        System.out.println("Email: " + email);

        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("User not found in database!");
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        System.out.println("User found in database:");
        System.out.println(" - Email: " + person.getEmail());
        System.out.println(" - Password hash: " + person.getPassword());
        System.out.println(" - Role: " + person.getRole());
        System.out.println(" - Enabled: " + person.getEnabled());

        return new PersonDetails(person);
    }
}