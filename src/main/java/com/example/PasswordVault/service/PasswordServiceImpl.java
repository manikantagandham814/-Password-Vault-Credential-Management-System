package com.example.PasswordVault.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.PasswordVault.dto.PasswordRequest;
import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.PasswordRepository;
import com.example.PasswordVault.util.AESUtil;

@Service
public class PasswordServiceImpl implements PasswordService {

    @Autowired
    private PasswordRepository passwordRepository;

    @Override
    public void savePassword(PasswordRequest request, User user) {

        Password password = new Password();

        password.setWebsiteName(request.getWebsiteName());
        password.setWebsiteUrl(request.getWebsiteUrl());
        password.setUsername(request.getUsername());

        // Encrypt Password
        password.setEncryptedPassword(
                AESUtil.encrypt(request.getPassword()));

        password.setCategory(request.getCategory());
        password.setNotes(request.getNotes());

        password.setCreatedAt(LocalDateTime.now());
        password.setUpdatedAt(LocalDateTime.now());

        password.setUser(user);

        passwordRepository.save(password);
    }

    @Override
    public List<Password> getAllPasswords(User user) {

        return passwordRepository.findByUser(user);

    }

    @Override
    public Password getPasswordById(Long id) {

        return passwordRepository.findById(id).orElse(null);

    }

    @Override
    public void updatePassword(Long id, PasswordRequest request) {

        Password password =
                passwordRepository.findById(id).orElse(null);

        if (password != null) {

            password.setWebsiteName(request.getWebsiteName());
            password.setWebsiteUrl(request.getWebsiteUrl());
            password.setUsername(request.getUsername());

            // Encrypt Updated Password
            password.setEncryptedPassword(
                    AESUtil.encrypt(request.getPassword()));

            password.setCategory(request.getCategory());
            password.setNotes(request.getNotes());

            password.setUpdatedAt(LocalDateTime.now());

            passwordRepository.save(password);

        }

    }

    @Override
    public void deletePassword(Long id) {

        passwordRepository.deleteById(id);

    }

    @Override
    public List<Password> searchPasswords(User user,
                                          String keyword) {

        return passwordRepository
                .findByUserAndWebsiteNameContainingIgnoreCase(user, keyword);

    }

}