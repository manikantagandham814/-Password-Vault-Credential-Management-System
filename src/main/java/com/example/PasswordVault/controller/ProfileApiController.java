package com.example.PasswordVault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.dto.ProfileRequest;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class ProfileApiController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    // ================= VIEW PROFILE =================

    @GetMapping
    public ResponseEntity<?> getProfile(
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");

        if (email == null) {

            return ResponseEntity
                    .status(401)
                    .body("Please login");
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(401)
                    .body("Please login");
        }

        return ResponseEntity.ok(user);
    }


    // ================= UPDATE PROFILE =================

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestBody ProfileRequest request,
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");

        if (email == null) {

            return ResponseEntity
                    .status(401)
                    .body("Please login");
        }

        userService.updateProfile(
                email,
                request
        );

        session.setAttribute(
                "fullName",
                request.getFullName()
        );

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        return ResponseEntity.ok(user);
    }
}