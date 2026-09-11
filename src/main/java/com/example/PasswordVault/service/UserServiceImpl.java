package com.example.PasswordVault.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.PasswordVault.dto.LoginRequest;
import com.example.PasswordVault.dto.RegisterRequest;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.dto.ProfileRequest;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =====================================================
    // REGISTER USER
    // =====================================================

    @Override
    public String registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email Already Exists";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return "Registration Successful";
    }


    // =====================================================
    // LOGIN USER
    // =====================================================

    @Override
    public boolean loginUser(LoginRequest request) {

        Optional<User> optionalUser =
                userRepository.findByEmail(request.getEmail());

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            return passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
            );
        }

        return false;
    }


    // =====================================================
    // CHECK EMAIL EXISTS
    // =====================================================

    @Override
    public boolean emailExists(String email) {

        return userRepository.existsByEmail(email);
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    @Override
    public String resetPassword(
            String email,
            String password) {

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            user.setPassword(
                    passwordEncoder.encode(password)
            );

            userRepository.save(user);

            return "Password Updated";
        }

        return "User Not Found";
    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    @Override
    public String changePassword(
            String email,
            String currentPassword,
            String newPassword) {

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "User Not Found";
        }

        User user = optionalUser.get();


        // -------------------------------------------------
        // VERIFY CURRENT PASSWORD
        // -------------------------------------------------

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword())) {

            return "Current Password is Incorrect";
        }


        // -------------------------------------------------
        // PREVENT SAME PASSWORD
        // -------------------------------------------------

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword())) {

            return "New Password must be different from Current Password";
        }


        // -------------------------------------------------
        // ENCRYPT NEW PASSWORD
        // -------------------------------------------------

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );


        // -------------------------------------------------
        // SAVE USER
        // -------------------------------------------------

        userRepository.save(user);

        return "Password Changed Successfully";
    }


    // =====================================================
    // GET USER BY EMAIL
    // =====================================================

    @Override
    public User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    @Override
    public void updateProfile(
            String email,
            ProfileRequest request) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user != null) {

            user.setFullName(
                    request.getFullName()
            );

            userRepository.save(user);
        }
    }

}