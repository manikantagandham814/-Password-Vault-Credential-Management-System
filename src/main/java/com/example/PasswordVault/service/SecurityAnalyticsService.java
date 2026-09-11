package com.example.PasswordVault.service;

import com.example.PasswordVault.dto.SecurityAnalyticsResponse;

public interface SecurityAnalyticsService {

    SecurityAnalyticsResponse
    getSecurityAnalytics(String email);
}