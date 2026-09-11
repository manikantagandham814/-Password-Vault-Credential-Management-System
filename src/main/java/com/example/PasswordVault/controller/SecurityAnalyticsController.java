package com.example.PasswordVault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.dto.SecurityAnalyticsResponse;
import com.example.PasswordVault.service.SecurityAnalyticsService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class SecurityAnalyticsController {

    @Autowired
    private SecurityAnalyticsService securityAnalyticsService;


    // =====================================================
    // SECURITY ANALYTICS DASHBOARD
    // =====================================================

    @GetMapping("/analytics")
    public ResponseEntity<?> getSecurityAnalytics(
            HttpSession session) {

        // -------------------------------------------------
        // Get logged-in user's email from session
        // -------------------------------------------------

        String email =
                (String) session.getAttribute("email");


        // -------------------------------------------------
        // Check login session
        // -------------------------------------------------

        if (email == null || email.isBlank()) {

            return ResponseEntity
                    .status(401)
                    .body("User not logged in");
        }


        // -------------------------------------------------
        // Get analytics data
        // -------------------------------------------------

        try {

            SecurityAnalyticsResponse response =
                    securityAnalyticsService
                            .getSecurityAnalytics(email);


            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}