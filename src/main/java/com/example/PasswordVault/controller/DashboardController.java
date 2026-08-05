package com.example.PasswordVault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.DashboardService;

import jakarta.servlet.http.HttpSession;

@Controller
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session,
                            Model model) {

        String email = (String) session.getAttribute("email");

        if (email == null) {
            return "redirect:/login";
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "redirect:/login";
        }

        model.addAttribute(
                "totalPasswords",
                dashboardService.getTotalPasswords(user));

        model.addAttribute(
                "totalWebsites",
                dashboardService.getTotalWebsites(user));

        List<Password> recentPasswords =
                dashboardService.getRecentPasswords(user);

        model.addAttribute(
                "recentPasswords",
                recentPasswords);

        return "dashboard";
    }

}