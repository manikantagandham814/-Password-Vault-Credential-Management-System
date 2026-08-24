package com.example.PasswordVault.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PasswordVault.entity.AuditLog;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.AuditLogRepository;

@Service
public class AuditLogServiceImpl
        implements AuditLogService {


    @Autowired
    private AuditLogRepository auditLogRepository;


    // =====================================================
    // CREATE AUDIT LOG
    // =====================================================

    @Override
    @Transactional
    public void createLog(
            User user,
            String action,
            String description) {

        if (user == null) {
            return;
        }


        AuditLog log =
                new AuditLog();


        log.setUser(user);

        log.setAction(action);

        log.setDescription(description);

        log.setTimestamp(
                LocalDateTime.now()
        );


        auditLogRepository.save(log);
    }


    // =====================================================
    // GET AUDIT LOGS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAuditLogs(
            User user) {

        if (user == null) {
            return List.of();
        }


        return auditLogRepository
                .findByUserOrderByTimestampDesc(
                        user
                );
    }
}