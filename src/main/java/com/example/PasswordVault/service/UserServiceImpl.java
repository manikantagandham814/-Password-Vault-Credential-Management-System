package com.example.PasswordVault.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.PasswordVault.dto.LoginRequest;
import com.example.PasswordVault.dto.RegisterRequest;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email Already Exists";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "Registration Successful";
    }

    @Override
    public boolean loginUser(LoginRequest request) {

        Optional<User> optionalUser =
                userRepository.findByEmail(request.getEmail());

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            return passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword());
        }

        return false;
    }

    @Override
    public boolean emailExists(String email) {

        return userRepository.existsByEmail(email);

    }

    @Override
    public String resetPassword(String email,
                                String password) {

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            user.setPassword(passwordEncoder.encode(password));

            userRepository.save(user);

            return "Password Updated";

        }

        return "User Not Found";
    }

    // ===========================
    // Get User By Email
    // ===========================

    @Override
    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email).orElse(null);

    }

}