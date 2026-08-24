package com.example.PasswordVault.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PasswordVault.entity.SecurityAlert;
import com.example.PasswordVault.entity.SecurityAlertSeverity;
import com.example.PasswordVault.entity.SecurityAlertStatus;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.SecurityAlertRepository;

@Service
public class SecurityAlertServiceImpl
        implements SecurityAlertService {


    // =====================================================
    // REPOSITORY
    // =====================================================

    @Autowired
    private SecurityAlertRepository securityAlertRepository;


    // =====================================================
    // CREATE SECURITY ALERT
    // =====================================================

    @Override
    @Transactional
    public void createAlert(
            User user,
            String alertType,
            String message) {

        if (user == null) {
            return;
        }


        // =================================================
        // CREATE NEW ALERT
        // =================================================
        //
        // Do NOT check for an old UNREAD alert here.
        //
        // Every newly detected suspicious incident should
        // generate its own security alert.
        // =================================================

        SecurityAlert alert =
                new SecurityAlert();


        alert.setUser(user);


        alert.setAlertType(
                alertType
        );


        alert.setMessage(
                message
        );


        // -------------------------------------------------
        // Current suspicious-login rule
        // -------------------------------------------------

        alert.setSeverity(
                SecurityAlertSeverity.HIGH
        );


        alert.setCreatedAt(
                LocalDateTime.now()
        );


        alert.setStatus(
                SecurityAlertStatus.UNREAD
        );


        securityAlertRepository.save(
                alert
        );
    }


    // =====================================================
    // GET SECURITY ALERTS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<SecurityAlert> getSecurityAlerts(
            User user) {

        if (user == null) {
            return List.of();
        }


        return securityAlertRepository
                .findByUserOrderByCreatedAtDesc(
                        user
                );
    }
}