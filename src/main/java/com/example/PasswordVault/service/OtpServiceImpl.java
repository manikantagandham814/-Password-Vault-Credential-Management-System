package com.example.PasswordVault.service;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;

@Service
public class OtpServiceImpl implements OtpService {

    private static final SecureRandom random = new SecureRandom();

    @Override
    public String generateOtp() {

        int otp = 100000 + random.nextInt(900000);

        return String.valueOf(otp);

    }

}