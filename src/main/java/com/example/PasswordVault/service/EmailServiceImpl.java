package com.example.PasswordVault.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Password Vault - OTP Verification");

        message.setText(
                "Dear User,\n\n"
              + "Your OTP for Password Reset is : "
              + otp
              + "\n\n"
              + "This OTP is valid for 5 minutes."
              + "\n\n"
              + "Thank You\n"
              + "Password Vault Team");

        mailSender.send(message);
    }
}