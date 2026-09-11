package com.example.PasswordVault.dto;

import java.util.List;

public class SecurityAnalyticsResponse {

    // =====================================================
    // SECURITY STATISTICS
    // =====================================================

    private long totalLogins;

    private long successfulLogins;

    private long failedLogins;

    private long suspiciousActivities;

    private long securityAlerts;


    // =====================================================
    // LOGIN ACTIVITY
    // =====================================================

    private List<LoginActivityResponse> loginActivity;


    // =====================================================
    // SUSPICIOUS ACTIVITIES
    // =====================================================

    private List<SuspiciousActivityResponse> suspiciousActivity;


    // =====================================================
    // SECURITY ALERTS
    // =====================================================

    private List<SecurityAlertResponse> securityAlertsList;


    // =====================================================
    // AUDIT / RECENT ACTIVITY
    // =====================================================

    private List<AuditLogResponse> recentActivity;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public SecurityAnalyticsResponse() {
    }


    // =====================================================
    // GETTERS & SETTERS
    // =====================================================

    public long getTotalLogins() {
        return totalLogins;
    }

    public void setTotalLogins(long totalLogins) {
        this.totalLogins = totalLogins;
    }


    public long getSuccessfulLogins() {
        return successfulLogins;
    }

    public void setSuccessfulLogins(long successfulLogins) {
        this.successfulLogins = successfulLogins;
    }


    public long getFailedLogins() {
        return failedLogins;
    }

    public void setFailedLogins(long failedLogins) {
        this.failedLogins = failedLogins;
    }


    public long getSuspiciousActivities() {
        return suspiciousActivities;
    }

    public void setSuspiciousActivities(
            long suspiciousActivities) {

        this.suspiciousActivities =
                suspiciousActivities;
    }


    public long getSecurityAlerts() {
        return securityAlerts;
    }

    public void setSecurityAlerts(
            long securityAlerts) {

        this.securityAlerts =
                securityAlerts;
    }


    public List<LoginActivityResponse>
    getLoginActivity() {

        return loginActivity;
    }


    public void setLoginActivity(
            List<LoginActivityResponse> loginActivity) {

        this.loginActivity =
                loginActivity;
    }


    public List<SuspiciousActivityResponse>
    getSuspiciousActivity() {

        return suspiciousActivity;
    }


    public void setSuspiciousActivity(
            List<SuspiciousActivityResponse>
                    suspiciousActivity) {

        this.suspiciousActivity =
                suspiciousActivity;
    }


    public List<SecurityAlertResponse>
    getSecurityAlertsList() {

        return securityAlertsList;
    }


    public void setSecurityAlertsList(
            List<SecurityAlertResponse>
                    securityAlertsList) {

        this.securityAlertsList =
                securityAlertsList;
    }


    public List<AuditLogResponse>
    getRecentActivity() {

        return recentActivity;
    }


    public void setRecentActivity(
            List<AuditLogResponse> recentActivity) {

        this.recentActivity =
                recentActivity;
    }


    // =====================================================
    // LOGIN ACTIVITY DTO
    // =====================================================

    public static class LoginActivityResponse {

        private String status;

        private String loginTime;


        public LoginActivityResponse() {
        }


        public LoginActivityResponse(
                String status,
                String loginTime) {

            this.status = status;

            this.loginTime = loginTime;
        }


        public String getStatus() {
            return status;
        }


        public void setStatus(String status) {
            this.status = status;
        }


        public String getLoginTime() {
            return loginTime;
        }


        public void setLoginTime(
                String loginTime) {

            this.loginTime = loginTime;
        }
    }


    // =====================================================
    // SUSPICIOUS ACTIVITY DTO
    // =====================================================

    public static class SuspiciousActivityResponse {

        private String activityType;

        private String description;

        private String detectedAt;

        private String status;


        public SuspiciousActivityResponse() {
        }


        public SuspiciousActivityResponse(
                String activityType,
                String description,
                String detectedAt,
                String status) {

            this.activityType =
                    activityType;

            this.description =
                    description;

            this.detectedAt =
                    detectedAt;

            this.status =
                    status;
        }


        public String getActivityType() {
            return activityType;
        }


        public void setActivityType(
                String activityType) {

            this.activityType =
                    activityType;
        }


        public String getDescription() {
            return description;
        }


        public void setDescription(
                String description) {

            this.description =
                    description;
        }


        public String getDetectedAt() {
            return detectedAt;
        }


        public void setDetectedAt(
                String detectedAt) {

            this.detectedAt =
                    detectedAt;
        }


        public String getStatus() {
            return status;
        }


        public void setStatus(
                String status) {

            this.status =
                    status;
        }
    }


    // =====================================================
    // SECURITY ALERT DTO
    // =====================================================

    public static class SecurityAlertResponse {

        private String alertType;

        private String message;

        private String severity;

        private String createdAt;

        private String status;


        public SecurityAlertResponse() {
        }


        public SecurityAlertResponse(
                String alertType,
                String message,
                String severity,
                String createdAt,
                String status) {

            this.alertType =
                    alertType;

            this.message =
                    message;

            this.severity =
                    severity;

            this.createdAt =
                    createdAt;

            this.status =
                    status;
        }


        public String getAlertType() {
            return alertType;
        }


        public void setAlertType(
                String alertType) {

            this.alertType =
                    alertType;
        }


        public String getMessage() {
            return message;
        }


        public void setMessage(
                String message) {

            this.message =
                    message;
        }


        public String getSeverity() {
            return severity;
        }


        public void setSeverity(
                String severity) {

            this.severity =
                    severity;
        }


        public String getCreatedAt() {
            return createdAt;
        }


        public void setCreatedAt(
                String createdAt) {

            this.createdAt =
                    createdAt;
        }


        public String getStatus() {
            return status;
        }


        public void setStatus(
                String status) {

            this.status =
                    status;
        }
    }


    // =====================================================
    // AUDIT LOG DTO
    // =====================================================

    public static class AuditLogResponse {

        private String action;

        private String description;

        private String timestamp;


        public AuditLogResponse() {
        }


        public AuditLogResponse(
                String action,
                String description,
                String timestamp) {

            this.action =
                    action;

            this.description =
                    description;

            this.timestamp =
                    timestamp;
        }


        public String getAction() {
            return action;
        }


        public void setAction(
                String action) {

            this.action =
                    action;
        }


        public String getDescription() {
            return description;
        }


        public void setDescription(
                String description) {

            this.description =
                    description;
        }


        public String getTimestamp() {
            return timestamp;
        }


        public void setTimestamp(
                String timestamp) {

            this.timestamp =
                    timestamp;
        }
    }
}