package com.example.PasswordVault.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;

@Entity
@Table(
    name = "password_shares",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_password_recipient",
            columnNames = {
                "password_id",
                "recipient_id"
            }
        )
    }
)
public class PasswordShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // PASSWORD BEING SHARED
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "password_id",
        nullable = false
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Password password;


    // =====================================================
    // USER WHO SHARED THE PASSWORD
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "shared_by_id",
        nullable = false
    )
    private User sharedBy;


    // =====================================================
    // USER RECEIVING THE PASSWORD
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "recipient_id",
        nullable = false
    )
    private User recipient;


    // =====================================================
    // PERMISSION
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SharePermission permission;


    // =====================================================
    // TIMESTAMPS
    // =====================================================

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PasswordShare() {
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


    public Password getPassword() {
        return password;
    }

    public void setPassword(Password password) {
        this.password = password;
    }


    public User getSharedBy() {
        return sharedBy;
    }

    public void setSharedBy(User sharedBy) {
        this.sharedBy = sharedBy;
    }


    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }


    public SharePermission getPermission() {
        return permission;
    }

    public void setPermission(
            SharePermission permission) {

        this.permission = permission;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }


    // =====================================================
    // AUTOMATIC TIMESTAMPS
    // =====================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }


    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}