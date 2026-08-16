package com.example.PasswordVault.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.PasswordShare;
import com.example.PasswordVault.entity.User;

@Repository
public interface PasswordShareRepository
        extends JpaRepository<PasswordShare, Long> {


    // =====================================================
    // Inbox
    // =====================================================

    List<PasswordShare>
    findByRecipientOrderByCreatedAtDesc(
            User recipient);


    // =====================================================
    // Sent
    // =====================================================

    List<PasswordShare>
    findBySharedByOrderByCreatedAtDesc(
            User sharedBy);


    // =====================================================
    // Existing share check
    // =====================================================

    Optional<PasswordShare>
    findByPasswordAndRecipient(
            Password password,
            User recipient);


    // =====================================================
    // All users having access to a password
    // =====================================================

    List<PasswordShare>
    findByPasswordOrderByCreatedAtDesc(
            Password password);
}