package com.example.PasswordVault.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // Email used during login attempt
    // =====================================================

    @Column(nullable = false)
    private String email;


    // =====================================================
    // Login result
    // SUCCESS / FAILED
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LoginStatus status;


    // =====================================================
    // Login date and time
    // =====================================================

    @Column(nullable = false)
    private LocalDateTime loginTime;


    // =====================================================
    // Constructor
    // =====================================================

    public LoginHistory() {
    }


    // =====================================================
    // Getters & Setters
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public LoginStatus getStatus() {
        return status;
    }

    public void setStatus(LoginStatus status) {
        this.status = status;
    }


    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }
}