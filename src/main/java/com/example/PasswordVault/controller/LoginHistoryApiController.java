package com.example.PasswordVault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.entity.LoginHistory;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.LoginHistoryService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/login-history")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class LoginHistoryApiController {


    @Autowired
    private LoginHistoryService loginHistoryService;


    @Autowired
    private UserRepository userRepository;


    // =====================================================
    // GET LOGIN HISTORY
    // GET /api/login-history
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getLoginHistory(
            HttpSession session) {


        String email =
                (String) session.getAttribute(
                        "email"
                );


        if (email == null) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            "Please login first"
                    );
        }


        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);


        if (user == null) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(
                            "User not found"
                    );
        }


        List<LoginHistory> history =
                loginHistoryService
                        .getLoginHistory(
                                user.getEmail()
                        );


        return ResponseEntity.ok(
                history
        );
    }
}