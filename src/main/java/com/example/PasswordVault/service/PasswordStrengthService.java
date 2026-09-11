package com.example.PasswordVault.service;

import org.springframework.stereotype.Service;

@Service
public class PasswordStrengthService {

    public String checkStrength(String password) {

        if (password == null || password.isEmpty()) {
            return "WEAK";
        }

        int score = 0;

        // Length
        if (password.length() >= 8) {
            score++;
        }

        if (password.length() >= 12) {
            score++;
        }

        // Lowercase
        if (password.matches(".*[a-z].*")) {
            score++;
        }

        // Uppercase
        if (password.matches(".*[A-Z].*")) {
            score++;
        }

        // Number
        if (password.matches(".*[0-9].*")) {
            score++;
        }

        // Special character
        if (password.matches(".*[^a-zA-Z0-9].*")) {
            score++;
        }


        // =================================================
        // STRENGTH
        // =================================================

        if (score >= 5) {

            return "STRONG";

        } else if (score >= 3) {

            return "MEDIUM";

        } else {

            return "WEAK";

        }
    }
}
