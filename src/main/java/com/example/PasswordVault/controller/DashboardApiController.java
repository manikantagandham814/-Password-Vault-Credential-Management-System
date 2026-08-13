package com.example.PasswordVault.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.DashboardService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class DashboardApiController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;


    // ===========================
    // DASHBOARD
    // ===========================

    @GetMapping
    public Map<String, Object> dashboard(
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");


        Map<String, Object> response =
                new HashMap<>();


        // ===========================
        // Check Login
        // ===========================

        if (email == null) {

            response.put(
                    "authenticated",
                    false
            );

            return response;
        }


        // ===========================
        // Get User
        // ===========================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);


        if (user == null) {

            response.put(
                    "authenticated",
                    false
            );

            return response;
        }


        // ===========================
        // Basic User Information
        // ===========================

        response.put(
                "authenticated",
                true
        );

        response.put(
                "fullName",
                user.getFullName()
        );

        response.put(
                "email",
                user.getEmail()
        );


        // ===========================
        // Total Passwords
        // ===========================

        response.put(
                "totalPasswords",
                dashboardService
                        .getTotalPasswords(user)
        );


        // ===========================
        // Total Websites
        // ===========================

        response.put(
                "totalWebsites",
                dashboardService
                        .getTotalWebsites(user)
        );


        // ===========================
        // Recent Passwords
        // ===========================

        List<Password> passwords =
                dashboardService
                        .getRecentPasswords(user);


        List<Map<String, Object>>
                recentPasswords =
                new ArrayList<>();


        for (Password password : passwords) {

            Map<String, Object> data =
                    new HashMap<>();


            data.put(
                    "id",
                    password.getId()
            );


            data.put(
                    "websiteName",
                    password.getWebsiteName()
            );


            data.put(
                    "username",
                    password.getUsername()
            );


            data.put(
                    "category",
                    password.getCategory()
            );


            recentPasswords.add(data);
        }


        response.put(
                "recentPasswords",
                recentPasswords
        );


        return response;
    }
}