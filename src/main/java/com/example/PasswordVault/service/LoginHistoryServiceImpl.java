package com.example.PasswordVault.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.PasswordVault.entity.LoginHistory;
import com.example.PasswordVault.entity.LoginStatus;
import com.example.PasswordVault.repository.LoginHistoryRepository;

@Service
public class LoginHistoryServiceImpl
        implements LoginHistoryService {


    @Autowired
    private LoginHistoryRepository loginHistoryRepository;


    // =====================================================
    // RECORD LOGIN ATTEMPT
    // =====================================================

    @Override
    public void recordLoginAttempt(
            String email,
            LoginStatus status) {

        LoginHistory history =
                new LoginHistory();


        history.setEmail(email);

        history.setStatus(status);

        history.setLoginTime(
                LocalDateTime.now()
        );


        loginHistoryRepository.save(
                history
        );
    }


    // =====================================================
    // GET LOGIN HISTORY
    // =====================================================

    @Override
    public List<LoginHistory> getLoginHistory(
            String email) {

        return loginHistoryRepository
                .findByEmailOrderByLoginTimeDesc(
                        email
                );
    }
}