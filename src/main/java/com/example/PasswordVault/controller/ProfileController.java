package com.example.PasswordVault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.PasswordVault.dto.ProfileRequest;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.UserService;

import jakarta.servlet.http.HttpSession;

@Controller
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // ==========================
    // View Profile
    // ==========================

    @GetMapping("/profile")
    public String profile(HttpSession session,
                          Model model) {

        String email = (String) session.getAttribute("email");

        if (email == null) {
            return "redirect:/login";
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "redirect:/login";
        }

        model.addAttribute("user", user);

        return "profile";
    }

    // ==========================
    // Edit Profile
    // ==========================

    @GetMapping("/edit-profile")
    public String editProfile(HttpSession session,
                              Model model) {

        String email = (String) session.getAttribute("email");

        if (email == null) {
            return "redirect:/login";
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "redirect:/login";
        }

        model.addAttribute("user", user);

        return "edit-profile";
    }

    // ==========================
    // Update Profile
    // ==========================

    @PostMapping("/update-profile")
    public String updateProfile(ProfileRequest request,
                                HttpSession session) {

        String email = (String) session.getAttribute("email");

        if (email == null) {
            return "redirect:/login";
        }

        userService.updateProfile(email, request);

        // Update session with new name
        session.setAttribute("fullName", request.getFullName());

        return "redirect:/profile";
    }

}