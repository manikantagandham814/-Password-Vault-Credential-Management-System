package com.example.PasswordVault.service;

import com.example.PasswordVault.dto.LoginRequest;
import com.example.PasswordVault.dto.ProfileRequest;
import com.example.PasswordVault.dto.RegisterRequest;
import com.example.PasswordVault.entity.User;

public interface UserService {

    // Register User
    String registerUser(RegisterRequest request);

    // Login User
    boolean loginUser(LoginRequest request);

    // Check Email Exists
    boolean emailExists(String email);

    // Reset Password
    String resetPassword(String email, String password);

    // Get User By Email
    User getUserByEmail(String email);

    // Update Profile (Full Name)
    void updateProfile(String email, ProfileRequest request);

}