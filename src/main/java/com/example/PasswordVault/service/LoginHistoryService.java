package com.example.PasswordVault.service;

import java.util.List;

import com.example.PasswordVault.entity.LoginHistory;
import com.example.PasswordVault.entity.LoginStatus;

public interface LoginHistoryService {

    void recordLoginAttempt(
            String email,
            LoginStatus status
    );


    List<LoginHistory> getLoginHistory(
            String email
    );
}