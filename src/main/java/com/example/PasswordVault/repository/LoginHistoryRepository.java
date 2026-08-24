package com.example.PasswordVault.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PasswordVault.entity.LoginHistory;
import com.example.PasswordVault.entity.LoginStatus;

@Repository
public interface LoginHistoryRepository
        extends JpaRepository<LoginHistory, Long> {


    // =====================================================
    // EXISTING LOGIN HISTORY
    // =====================================================

    List<LoginHistory>
    findByEmailOrderByLoginTimeDesc(String email);


    // =====================================================
    // SUSPICIOUS ACTIVITY DETECTION
    //
    // Finds failed login attempts for an email
    // after the given time.
    // =====================================================

    List<LoginHistory>
    findByEmailAndStatusAndLoginTimeAfterOrderByLoginTimeDesc(
            String email,
            LoginStatus status,
            LocalDateTime time
    );


    // =====================================================
    // COUNT FAILED LOGIN ATTEMPTS
    // =====================================================

    long countByEmailAndStatusAndLoginTimeAfter(
            String email,
            LoginStatus status,
            LocalDateTime time
    );
}