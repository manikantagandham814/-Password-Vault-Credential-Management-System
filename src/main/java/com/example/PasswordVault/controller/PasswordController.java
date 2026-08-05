package com.example.PasswordVault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.dto.PasswordRequest;
import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.PasswordService;
import com.example.PasswordVault.util.AESUtil;

import jakarta.servlet.http.HttpSession;

@Controller
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private UserRepository userRepository;

    // ===========================
    // Add Password Page
    // ===========================

    @GetMapping("/add-password")
    public String addPasswordPage() {

        return "add-password";

    }

    // ===========================
    // Save Password
    // ===========================

    @PostMapping("/add-password")
    public String savePassword(PasswordRequest request,
                               HttpSession session) {

        String email = (String) session.getAttribute("email");

        if (email == null) {

            return "redirect:/login";

        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            return "redirect:/login";

        }

        passwordService.savePassword(request, user);

        return "redirect:/passwords";

    }

    // ===========================
    // View All Passwords
    // ===========================

    @GetMapping("/passwords")
    public String viewPasswords(HttpSession session,
                                Model model) {

        String email = (String) session.getAttribute("email");

        if (email == null) {

            return "redirect:/login";

        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            return "redirect:/login";

        }

        List<Password> passwords =
                passwordService.getAllPasswords(user);

        model.addAttribute("passwords", passwords);

        return "passwords";

    }

    // ===========================
    // View Password
    // ===========================

    @GetMapping("/view-password/{id}")
    public String viewPassword(@PathVariable Long id,
                               HttpSession session,
                               Model model) {

        String email = (String) session.getAttribute("email");

        if (email == null) {

            return "redirect:/login";

        }

        Password password =
                passwordService.getPasswordById(id);

        if (password == null) {

            return "redirect:/passwords";

        }

        String decryptedPassword =
                AESUtil.decrypt(password.getEncryptedPassword());

        model.addAttribute("password", password);

        model.addAttribute("decryptedPassword",
                decryptedPassword);

        return "view-password";

    }

    // ===========================
    // Edit Password Page
    // ===========================

    @GetMapping("/edit-password/{id}")
    public String editPassword(@PathVariable Long id,
                               HttpSession session,
                               Model model) {

        String email = (String) session.getAttribute("email");

        if (email == null) {

            return "redirect:/login";

        }

        Password password =
                passwordService.getPasswordById(id);

        if (password == null) {

            return "redirect:/passwords";

        }

        String decryptedPassword =
                AESUtil.decrypt(password.getEncryptedPassword());

        model.addAttribute("password", password);

        model.addAttribute("decryptedPassword",
                decryptedPassword);

        return "edit-password";

    }

    // ===========================
    // Update Password
    // ===========================

    @PostMapping("/update-password/{id}")
    public String updatePassword(@PathVariable Long id,
                                 PasswordRequest request,
                                 HttpSession session) {

        String email = (String) session.getAttribute("email");

        if (email == null) {

            return "redirect:/login";

        }

        passwordService.updatePassword(id, request);

        return "redirect:/passwords";

    }

    // ===========================
    // Delete Password
    // ===========================

    @GetMapping("/delete-password/{id}")
    public String deletePassword(@PathVariable Long id,
                                 HttpSession session) {

        String email = (String) session.getAttribute("email");

        if (email == null) {

            return "redirect:/login";

        }

        passwordService.deletePassword(id);

        return "redirect:/passwords";

    }

    // ===========================
    // Search Password
    // ===========================

    @GetMapping("/search")
    public String searchPassword(@RequestParam("keyword") String keyword,
                                 HttpSession session,
                                 Model model) {

        String email = (String) session.getAttribute("email");

        if (email == null) {

            return "redirect:/login";

        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {

            return "redirect:/login";

        }

        List<Password> passwords =
                passwordService.searchPasswords(user, keyword);

        model.addAttribute("passwords", passwords);

        return "passwords";

    }

}