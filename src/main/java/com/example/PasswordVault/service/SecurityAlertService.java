package com.example.PasswordVault.service;

import java.util.List;

import com.example.PasswordVault.entity.SecurityAlert;
import com.example.PasswordVault.entity.User;

public interface SecurityAlertService {

    // =====================================================
    // CREATE SECURITY ALERT
    // =====================================================

    void createAlert(
            User user,
            String alertType,
            String message
    );


    // =====================================================
    // GET SECURITY ALERTS
    // =====================================================

    List<SecurityAlert> getSecurityAlerts(
            User user
    );
}