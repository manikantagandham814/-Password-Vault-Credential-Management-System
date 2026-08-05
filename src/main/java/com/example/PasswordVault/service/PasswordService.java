package com.example.PasswordVault.service;

import java.util.List;

import com.example.PasswordVault.dto.PasswordRequest;
import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;

public interface PasswordService {

    // Save Password
    void savePassword(PasswordRequest request, User user);

    // View All Passwords
    List<Password> getAllPasswords(User user);

    // Get Password By Id
    Password getPasswordById(Long id);

    // Update Password
    void updatePassword(Long id, PasswordRequest request);

    // Delete Password
    void deletePassword(Long id);

    // Search Passwords
    List<Password> searchPasswords(User user, String keyword);

}