package com.example.PasswordVault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PasswordVault.entity.SecurityAlert;
import com.example.PasswordVault.entity.SecurityAlertStatus;
import com.example.PasswordVault.entity.User;

@Repository
public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {


    // =====================================================
    // GET ALL ALERTS FOR A USER
    // =====================================================

    List<SecurityAlert>
    findByUserOrderByCreatedAtDesc(
            User user
    );


    // =====================================================
    // CHECK EXISTING UNREAD ALERT
    //
    // Prevents duplicate alerts for the same
    // suspicious activity while the alert is unread.
    // =====================================================

    boolean existsByUserAndAlertTypeAndStatus(
            User user,
            String alertType,
            SecurityAlertStatus status
    );
}