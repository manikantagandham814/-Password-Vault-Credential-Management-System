package com.example.PasswordVault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.dto.PasswordHealthResponse;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.service.PasswordHealthService;
import com.example.PasswordVault.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class ReportController {

    @Autowired
    private PasswordHealthService passwordHealthService;

    @Autowired
    private UserService userService;


    // =====================================================
    // PASSWORD HEALTH REPORT
    // =====================================================

    @GetMapping("/password-health")
    public ResponseEntity<?> getPasswordHealth(
            HttpSession session) {

        // ---------------------------------------------
        // Get logged-in email from session
        // ---------------------------------------------

        String email =
                (String) session.getAttribute("email");


        // ---------------------------------------------
        // Check login session
        // ---------------------------------------------

        if (email == null) {

            return ResponseEntity
                    .status(401)
                    .body("User not authenticated");
        }


        // ---------------------------------------------
        // Get User from database
        // ---------------------------------------------

        User user =
                userService.getUserByEmail(email);


        if (user == null) {

            return ResponseEntity
                    .status(401)
                    .body("User not found");
        }


        // ---------------------------------------------
        // Generate password health report
        // ---------------------------------------------

        PasswordHealthResponse response =
                passwordHealthService
                        .getPasswordHealth(user);


        return ResponseEntity.ok(response);
    }
}