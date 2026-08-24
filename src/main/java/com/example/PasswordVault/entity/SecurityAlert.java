package com.example.PasswordVault.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "security_alerts")
public class SecurityAlert {

    // =====================================================
    // ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // USER
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;


    // =====================================================
    // ALERT TYPE
    // =====================================================

    @Column(
        name = "alert_type",
        nullable = false,
        length = 100
    )
    private String alertType;


    // =====================================================
    // MESSAGE
    // =====================================================

    @Column(
        nullable = false,
        length = 500
    )
    private String message;


    // =====================================================
    // SEVERITY
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 20
    )
    private SecurityAlertSeverity severity;


    // =====================================================
    // CREATED AT
    // =====================================================

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt;


    // =====================================================
    // STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 20
    )
    private SecurityAlertStatus status;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public SecurityAlert() {
    }


    // =====================================================
    // GETTERS & SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public SecurityAlertSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(
            SecurityAlertSeverity severity) {

        this.severity = severity;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }


    public SecurityAlertStatus getStatus() {
        return status;
    }

    public void setStatus(
            SecurityAlertStatus status) {

        this.status = status;
    }
}