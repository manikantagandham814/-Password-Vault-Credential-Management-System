package com.example.PasswordVault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PasswordVault.entity.AuditLog;
import com.example.PasswordVault.entity.User;

@Repository
public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {


    // =====================================================
    // GET AUDIT LOGS FOR A USER
    // =====================================================

    List<AuditLog>
    findByUserOrderByTimestampDesc(
            User user
    );
}