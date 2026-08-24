package com.example.PasswordVault.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

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
    // ACTION
    // =====================================================

    @Column(
        nullable = false,
        length = 100
    )
    private String action;


    // =====================================================
    // DESCRIPTION
    // =====================================================

    @Column(
        nullable = false,
        length = 500
    )
    private String description;


    // =====================================================
    // TIMESTAMP
    // =====================================================

    @Column(
        name = "timestamp",
        nullable = false
    )
    private LocalDateTime timestamp;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AuditLog() {
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


    public String getAction() {
        return action;
    }


    public void setAction(String action) {
        this.action = action;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(
            String description) {

        this.description = description;
    }


    public LocalDateTime getTimestamp() {
        return timestamp;
    }


    public void setTimestamp(
            LocalDateTime timestamp) {

        this.timestamp = timestamp;
    }
}