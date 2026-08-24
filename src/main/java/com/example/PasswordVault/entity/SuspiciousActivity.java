package com.example.PasswordVault.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "suspicious_activities")
public class SuspiciousActivity {

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
    // ACTIVITY TYPE
    // =====================================================

    @Column(
        name = "activity_type",
        nullable = false,
        length = 100
    )
    private String activityType;


    // =====================================================
    // DESCRIPTION
    // =====================================================

    @Column(
        nullable = false,
        length = 500
    )
    private String description;


    // =====================================================
    // DETECTED AT
    // =====================================================

    @Column(
        name = "detected_at",
        nullable = false
    )
    private LocalDateTime detectedAt;


    // =====================================================
    // STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 30
    )
    private SuspiciousActivityStatus status;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public SuspiciousActivity() {
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


    public String getActivityType() {
        return activityType;
    }


    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }


    public void setDetectedAt(
            LocalDateTime detectedAt) {

        this.detectedAt = detectedAt;
    }


    public SuspiciousActivityStatus getStatus() {
        return status;
    }


    public void setStatus(
            SuspiciousActivityStatus status) {

        this.status = status;
    }
}