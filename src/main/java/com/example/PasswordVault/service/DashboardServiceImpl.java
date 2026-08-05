package com.example.PasswordVault.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.PasswordRepository;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PasswordRepository passwordRepository;

    @Override
    public long getTotalPasswords(User user) {

        return passwordRepository.countByUser(user);

    }

    @Override
    public long getTotalWebsites(User user) {

        List<Password> passwords =
                passwordRepository.findByUser(user);

        Set<String> websites = new HashSet<>();

        for (Password password : passwords) {

            websites.add(password.getWebsiteName());

        }

        return websites.size();

    }

    @Override
    public List<Password> getRecentPasswords(User user) {

        return passwordRepository
                .findTop5ByUserOrderByCreatedAtDesc(user);

    }

}