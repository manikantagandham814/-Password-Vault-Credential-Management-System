package com.example.PasswordVault.service;

public interface EmailService {

    void sendOtp(String toEmail, String otp);

}