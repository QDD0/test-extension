package org.example.testextension.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String first_name;
    private String last_name;
    private String surname;

    public RegisterRequest(String email, String password, String first_name, String last_name, String surname) {
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getSurname() {
        return surname;
    }
}