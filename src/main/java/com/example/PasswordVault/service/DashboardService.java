package com.example.PasswordVault.service;

import java.util.List;

import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;

public interface DashboardService {

    long getTotalPasswords(User user);

    long getTotalWebsites(User user);

    List<Password> getRecentPasswords(User user);

}