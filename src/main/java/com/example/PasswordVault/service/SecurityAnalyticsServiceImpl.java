package com.example.PasswordVault.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.PasswordVault.dto.SecurityAnalyticsResponse;
import com.example.PasswordVault.entity.AuditLog;
import com.example.PasswordVault.entity.LoginHistory;
import com.example.PasswordVault.entity.LoginStatus;
import com.example.PasswordVault.entity.SecurityAlert;
import com.example.PasswordVault.entity.SuspiciousActivity;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.AuditLogRepository;
import com.example.PasswordVault.repository.LoginHistoryRepository;
import com.example.PasswordVault.repository.SecurityAlertRepository;
import com.example.PasswordVault.repository.SuspiciousActivityRepository;

@Service
public class SecurityAnalyticsServiceImpl
        implements SecurityAnalyticsService {

    @Autowired
    private UserService userService;

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @Autowired
    private SuspiciousActivityRepository suspiciousActivityRepository;

    @Autowired
    private SecurityAlertRepository securityAlertRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;


    // =====================================================
    // GET SECURITY ANALYTICS
    // =====================================================

    @Override
    public SecurityAnalyticsResponse getSecurityAnalytics(
            String email) {

        // -------------------------------------------------
        // Find logged-in user
        // -------------------------------------------------

        User user =
                userService.getUserByEmail(email);

        if (user == null) {
            throw new RuntimeException(
                    "User not found"
            );
        }


        // =================================================
        // CREATE RESPONSE
        // =================================================

        SecurityAnalyticsResponse response =
                new SecurityAnalyticsResponse();


        // =================================================
        // LOGIN HISTORY
        // =================================================

        List<LoginHistory> loginHistory =
                loginHistoryRepository
                        .findByEmailOrderByLoginTimeDesc(
                                email
                        );


        // -------------------------------------------------
        // TOTAL LOGINS
        // -------------------------------------------------

        long totalLogins =
                loginHistory.size();


        // -------------------------------------------------
        // SUCCESSFUL LOGINS
        // -------------------------------------------------

        long successfulLogins =
                loginHistory.stream()
                        .filter(history ->
                                history.getStatus()
                                        == LoginStatus.SUCCESS)
                        .count();


        // -------------------------------------------------
        // FAILED LOGINS
        // -------------------------------------------------

        long failedLogins =
                loginHistory.stream()
                        .filter(history ->
                                history.getStatus()
                                        == LoginStatus.FAILED)
                        .count();


        response.setTotalLogins(
                totalLogins
        );

        response.setSuccessfulLogins(
                successfulLogins
        );

        response.setFailedLogins(
                failedLogins
        );


        // =================================================
        // LOGIN ACTIVITY
        // =================================================

        List<SecurityAnalyticsResponse.LoginActivityResponse>
                loginActivity =
                loginHistory.stream()
                        .map(history ->
                                new SecurityAnalyticsResponse
                                        .LoginActivityResponse(
                                                history.getStatus()
                                                        .name(),
                                                history.getLoginTime()
                                                        .toString()
                                        )
                        )
                        .collect(Collectors.toList());


        response.setLoginActivity(
                loginActivity
        );


        // =================================================
        // SUSPICIOUS ACTIVITIES
        // =================================================

        List<SuspiciousActivity>
                suspiciousActivities =
                suspiciousActivityRepository
                        .findByUserOrderByDetectedAtDesc(
                                user
                        );


        response.setSuspiciousActivities(
                suspiciousActivities.size()
        );


        List<SecurityAnalyticsResponse
                .SuspiciousActivityResponse>
                suspiciousActivityList =
                suspiciousActivities.stream()
                        .map(activity ->
                                new SecurityAnalyticsResponse
                                        .SuspiciousActivityResponse(
                                                activity.getActivityType(),
                                                activity.getDescription(),
                                                activity.getDetectedAt()
                                                        .toString(),
                                                activity.getStatus()
                                                        .name()
                                        )
                        )
                        .collect(Collectors.toList());


        response.setSuspiciousActivity(
                suspiciousActivityList
        );


        // =================================================
        // SECURITY ALERTS
        // =================================================

        List<SecurityAlert>
                securityAlerts =
                securityAlertRepository
                        .findByUserOrderByCreatedAtDesc(
                                user
                        );


        response.setSecurityAlerts(
                securityAlerts.size()
        );


        List<SecurityAnalyticsResponse
                .SecurityAlertResponse>
                securityAlertList =
                securityAlerts.stream()
                        .map(alert ->
                                new SecurityAnalyticsResponse
                                        .SecurityAlertResponse(
                                                alert.getAlertType(),
                                                alert.getMessage(),
                                                alert.getSeverity()
                                                        .name(),
                                                alert.getCreatedAt()
                                                        .toString(),
                                                alert.getStatus()
                                                        .name()
                                        )
                        )
                        .collect(Collectors.toList());


        response.setSecurityAlertsList(
                securityAlertList
        );


        // =================================================
        // AUDIT / RECENT ACTIVITY
        // =================================================

        List<AuditLog>
                auditLogs =
                auditLogRepository
                        .findByUserOrderByTimestampDesc(
                                user
                        );


        List<SecurityAnalyticsResponse
                .AuditLogResponse>
                recentActivity =
                auditLogs.stream()
                        .map(log ->
                                new SecurityAnalyticsResponse
                                        .AuditLogResponse(
                                                log.getAction(),
                                                log.getDescription(),
                                                log.getTimestamp()
                                                        .toString()
                                        )
                        )
                        .collect(Collectors.toList());


        response.setRecentActivity(
                recentActivity
        );


        // =================================================
        // RETURN COMPLETE ANALYTICS
        // =================================================

        return response;
    }
}