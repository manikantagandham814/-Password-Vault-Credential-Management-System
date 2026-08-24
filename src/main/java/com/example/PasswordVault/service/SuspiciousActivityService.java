package com.example.PasswordVault.service;

import java.util.List;

import com.example.PasswordVault.entity.SuspiciousActivity;
import com.example.PasswordVault.entity.User;

public interface SuspiciousActivityService {


    // =====================================================
    // ANALYZE LOGIN ACTIVITY
    // =====================================================

    void analyzeLoginActivity(
            String email
    );


    // =====================================================
    // GET SUSPICIOUS ACTIVITIES
    // =====================================================

    List<SuspiciousActivity> getSuspiciousActivities(
            User user
    );
}