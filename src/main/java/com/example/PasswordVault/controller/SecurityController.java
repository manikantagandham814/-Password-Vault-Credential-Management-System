package com.example.PasswordVault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.entity.AuditLog;
import com.example.PasswordVault.entity.SecurityAlert;
import com.example.PasswordVault.entity.SuspiciousActivity;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.AuditLogService;
import com.example.PasswordVault.service.SecurityAlertService;
import com.example.PasswordVault.service.SuspiciousActivityService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class SecurityController {


    // =====================================================
    // SERVICES
    // =====================================================

    @Autowired
    private SecurityAlertService securityAlertService;


    @Autowired
    private SuspiciousActivityService suspiciousActivityService;


    @Autowired
    private AuditLogService auditLogService;


    // =====================================================
    // USER REPOSITORY
    // =====================================================

    @Autowired
    private UserRepository userRepository;


    // =====================================================
    // SECURITY ALERTS
    //
    // GET /api/security/alerts
    // =====================================================

    @GetMapping("/alerts")
    public ResponseEntity<?> getSecurityAlerts(
            HttpSession session) {

        User user =
                getLoggedInUser(session);


        if (user == null) {

            return unauthorized();
        }


        List<SecurityAlert> alerts =
                securityAlertService
                        .getSecurityAlerts(user);


        return ResponseEntity.ok(
                alerts
        );
    }


    // =====================================================
    // SUSPICIOUS ACTIVITIES
    //
    // GET /api/security/suspicious
    // =====================================================

    @GetMapping("/suspicious")
    public ResponseEntity<?> getSuspiciousActivities(
            HttpSession session) {

        User user =
                getLoggedInUser(session);


        if (user == null) {

            return unauthorized();
        }


        List<SuspiciousActivity> activities =
                suspiciousActivityService
                        .getSuspiciousActivities(user);


        return ResponseEntity.ok(
                activities
        );
    }


    // =====================================================
    // AUDIT LOGS
    //
    // GET /api/security/audit-logs
    // =====================================================

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(
            HttpSession session) {

        User user =
                getLoggedInUser(session);


        if (user == null) {

            return unauthorized();
        }


        List<AuditLog> logs =
                auditLogService
                        .getAuditLogs(user);


        return ResponseEntity.ok(
                logs
        );
    }


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    private User getLoggedInUser(
            HttpSession session) {

        String email =
                (String) session.getAttribute(
                        "email"
                );


        if (email == null) {

            return null;
        }


        return userRepository
                .findByEmail(email)
                .orElse(null);
    }


    // =====================================================
    // UNAUTHORIZED
    // =====================================================

    private ResponseEntity<?> unauthorized() {

        return ResponseEntity
                .status(
                        HttpStatus.UNAUTHORIZED
                )
                .body(
                        "Please login first"
                );
    }
}