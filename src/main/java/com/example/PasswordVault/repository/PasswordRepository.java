package com.example.PasswordVault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;

@Repository
public interface PasswordRepository extends JpaRepository<Password, Long> {

    List<Password> findByUser(User user);

    List<Password> findByUserAndWebsiteNameContainingIgnoreCase(User user, String keyword);

    // Total Passwords
    long countByUser(User user);

    // Recent Passwords (Latest 5)
    List<Password> findTop5ByUserOrderByCreatedAtDesc(User user);

}