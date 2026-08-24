package com.example.PasswordVault.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PasswordVault.entity.SuspiciousActivity;
import com.example.PasswordVault.entity.SuspiciousActivityStatus;
import com.example.PasswordVault.entity.User;

@Repository
public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity>
    findByUserOrderByDetectedAtDesc(
            User user
    );


    boolean existsByUserAndActivityTypeAndStatus(
            User user,
            String activityType,
            SuspiciousActivityStatus status
    );


    boolean existsByUserAndActivityTypeAndDetectedAtAfter(
            User user,
            String activityType,
            LocalDateTime detectedAt
    );
}