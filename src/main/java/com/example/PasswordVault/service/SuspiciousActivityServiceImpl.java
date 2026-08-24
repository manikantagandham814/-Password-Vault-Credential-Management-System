package com.example.PasswordVault.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PasswordVault.entity.LoginStatus;
import com.example.PasswordVault.entity.SuspiciousActivity;
import com.example.PasswordVault.entity.SuspiciousActivityStatus;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.LoginHistoryRepository;
import com.example.PasswordVault.repository.SuspiciousActivityRepository;
import com.example.PasswordVault.repository.UserRepository;

@Service
public class SuspiciousActivityServiceImpl
        implements SuspiciousActivityService {


    // =====================================================
    // SUSPICIOUS ACTIVITY RULE
    // =====================================================

    private static final int FAILED_ATTEMPT_THRESHOLD = 5;

    private static final int DETECTION_WINDOW_MINUTES = 10;


    // =====================================================
    // CONSTANTS
    // =====================================================

    private static final String ACTIVITY_TYPE =
            "MULTIPLE_FAILED_LOGINS";

    private static final String AUDIT_ACTION =
            "SUSPICIOUS_ACTIVITY";


    // =====================================================
    // REPOSITORIES
    // =====================================================

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;


    @Autowired
    private SuspiciousActivityRepository suspiciousActivityRepository;


    @Autowired
    private UserRepository userRepository;


    // =====================================================
    // SERVICES
    // =====================================================

    @Autowired
    private SecurityAlertService securityAlertService;


    @Autowired
    private AuditLogService auditLogService;


    // =====================================================
    // ANALYZE LOGIN ACTIVITY
    // =====================================================

    @Override
    @Transactional
    public void analyzeLoginActivity(
            String email) {

        // -------------------------------------------------
        // Validate email
        // -------------------------------------------------

        if (email == null ||
            email.trim().isEmpty()) {

            return;
        }


        String normalizedEmail =
                email.trim();


        // -------------------------------------------------
        // Find registered user
        // -------------------------------------------------

        User user =
                userRepository
                        .findByEmail(normalizedEmail)
                        .orElse(null);


        /*
         * If the email is not registered,
         * LoginHistory will still contain the FAILED login.
         *
         * But there is no User entity to attach
         * SuspiciousActivity, SecurityAlert and AuditLog to.
         */

        if (user == null) {

            return;
        }


        // -------------------------------------------------
        // Current time
        // -------------------------------------------------

        LocalDateTime now =
                LocalDateTime.now();


        // -------------------------------------------------
        // Detection window
        // -------------------------------------------------

        LocalDateTime windowStart =
                now.minusMinutes(
                        DETECTION_WINDOW_MINUTES
                );


        // -------------------------------------------------
        // Count failed attempts
        // -------------------------------------------------

        long failedAttempts =
                loginHistoryRepository
                        .countByEmailAndStatusAndLoginTimeAfter(
                                normalizedEmail,
                                LoginStatus.FAILED,
                                windowStart
                        );


        // -------------------------------------------------
        // Threshold not reached
        // -------------------------------------------------

        if (failedAttempts <
                FAILED_ATTEMPT_THRESHOLD) {

            return;
        }


        // =================================================
        // CHECK CURRENT ATTACK WINDOW
        // =================================================
        //
        // We do NOT check whether the user has EVER had
        // a suspicious activity.
        //
        // We only check whether there is already a
        // suspicious activity created during the
        // CURRENT detection window.
        // =================================================

        LocalDateTime currentWindowStart =
                now.minusMinutes(
                        DETECTION_WINDOW_MINUTES
                );


        boolean alreadyDetected =
                suspiciousActivityRepository
                        .existsByUserAndActivityTypeAndDetectedAtAfter(
                                user,
                                ACTIVITY_TYPE,
                                currentWindowStart
                        );


        // -------------------------------------------------
        // Already detected in this attack window
        // -------------------------------------------------

        if (alreadyDetected) {

            return;
        }


        // =================================================
        // CREATE SUSPICIOUS ACTIVITY
        // =================================================

        String description =
                failedAttempts
                + " failed login attempts detected within "
                + DETECTION_WINDOW_MINUTES
                + " minutes";


        SuspiciousActivity activity =
                new SuspiciousActivity();


        activity.setUser(user);


        activity.setActivityType(
                ACTIVITY_TYPE
        );


        activity.setDescription(
                description
        );


        activity.setDetectedAt(
                now
        );


        activity.setStatus(
                SuspiciousActivityStatus.FLAGGED
        );


        suspiciousActivityRepository.save(
                activity
        );


        // =================================================
        // CREATE SECURITY ALERT
        // =================================================

        securityAlertService.createAlert(

                user,

                ACTIVITY_TYPE,

                "Multiple failed login attempts detected. "
                + "Please review your account security."
        );


        // =================================================
        // CREATE AUDIT LOG
        // =================================================

        auditLogService.createLog(

                user,

                AUDIT_ACTION,

                description
        );
    }


    // =====================================================
    // GET SUSPICIOUS ACTIVITIES
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<SuspiciousActivity>
    getSuspiciousActivities(
            User user) {

        if (user == null) {

            return List.of();
        }


        return suspiciousActivityRepository
                .findByUserOrderByDetectedAtDesc(
                        user
                );
    }
}