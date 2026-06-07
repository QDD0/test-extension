package org.example.testextension.dto;

import jakarta.annotation.PostConstruct;
import org.example.testextension.enums.Role;
import org.example.testextension.models.Person;
import org.example.testextension.repositories.PersonRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer {
    private final PersonRepository personRepository;
    private final BCryptPasswordEncoder encoder;

    public AdminInitializer(PersonRepository personRepository,
                            BCryptPasswordEncoder encoder) {
        this.personRepository = personRepository;
        this.encoder = encoder;
    }

    @PostConstruct
    public void init() {
        if (personRepository.findByEmail("dend51108@gmail.com").isEmpty()) {
            Person admin = new Person();

            admin.setFirst_name("Tik");
            admin.setLast_name("Tak");
            admin.setSurname("Tak");
            admin.setEmail("dend51108@gmail.com");
            admin.setPassword(encoder.encode("123456"));
            admin.setRole(Role.ROLE_ADMIN);

            personRepository.save(admin);
        }
    }
}
