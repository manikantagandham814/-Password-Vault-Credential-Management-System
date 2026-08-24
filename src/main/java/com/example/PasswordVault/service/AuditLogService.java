package com.example.PasswordVault.service;

import java.util.List;

import com.example.PasswordVault.entity.AuditLog;
import com.example.PasswordVault.entity.User;

public interface AuditLogService {


    // =====================================================
    // CREATE AUDIT LOG
    // =====================================================

    void createLog(
            User user,
            String action,
            String description
    );


    // =====================================================
    // GET AUDIT LOGS
    // =====================================================

    List<AuditLog> getAuditLogs(
            User user
    );
}