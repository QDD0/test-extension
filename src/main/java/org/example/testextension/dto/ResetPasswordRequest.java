package org.example.testextension.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String token;
    private String newPassword;
}