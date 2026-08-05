package com.example.PasswordVault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.PasswordVault.dto.ForgotPasswordRequest;
import com.example.PasswordVault.dto.LoginRequest;
import com.example.PasswordVault.dto.RegisterRequest;
import com.example.PasswordVault.dto.ResetPasswordRequest;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.service.EmailService;
import com.example.PasswordVault.service.OtpService;
import com.example.PasswordVault.service.UserService;

import jakarta.servlet.http.HttpSession;

@Controller
public class HomeController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    // ================= HOME =================

    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }

    // ================= LOGIN =================

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String login(LoginRequest request,
                        Model model,
                        HttpSession session) {

        boolean status = userService.loginUser(request);

        if (status) {

            User user = userService.getUserByEmail(request.getEmail());

            session.setAttribute("email", user.getEmail());
            session.setAttribute("fullName", user.getFullName());

            return "redirect:/dashboard";
        }

        model.addAttribute("error", "Invalid Email or Password");

        return "login";
    }

    // ================= REGISTER =================

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/register")
    public String register(RegisterRequest request,
                           Model model) {

        String result = userService.registerUser(request);

        if(result.equals("Registration Successful")) {

            model.addAttribute("success",
                    "Registration Successful. Please Login.");

            return "login";
        }

        model.addAttribute("error", result);

        return "register";
    }

    // ================= FORGOT PASSWORD =================

    @GetMapping("/forgot-password")
    public String forgotPasswordPage() {

        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String sendOtp(ForgotPasswordRequest request,
                          HttpSession session,
                          Model model) {

        String email = request.getEmail();

        if(!userService.emailExists(email)) {

            model.addAttribute("error",
                    "Email not registered");

            return "forgot-password";
        }

        String otp = otpService.generateOtp();

        session.setAttribute("otp", otp);
        session.setAttribute("resetEmail", email);
        session.setAttribute("otpTime", System.currentTimeMillis());

        emailService.sendOtp(email, otp);

        return "redirect:/verify-otp";
    }

    // ================= VERIFY OTP =================

    @GetMapping("/verify-otp")
    public String verifyOtpPage(HttpSession session,
                                Model model) {

        Long otpTime = (Long) session.getAttribute("otpTime");

        if (otpTime == null) {
            return "redirect:/forgot-password";
        }

        long currentTime = System.currentTimeMillis();
        long elapsed = (currentTime - otpTime) / 1000;
        long remaining = 60 - elapsed;

        if (remaining < 0) {
            remaining = 0;
        }

        model.addAttribute("remainingTime", remaining);

        return "verify-otp";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam("otp") String otp,
                            HttpSession session,
                            Model model) {

        String sessionOtp = (String) session.getAttribute("otp");
        Long otpTime = (Long) session.getAttribute("otpTime");

        if(sessionOtp == null || otpTime == null) {

            model.addAttribute("error", "OTP Expired");

            return "verify-otp";
        }

        long currentTime = System.currentTimeMillis();

        if(currentTime - otpTime > 60000) {

            session.removeAttribute("otp");
            session.removeAttribute("otpTime");

            model.addAttribute("error", "OTP Expired");

            return "verify-otp";
        }

        if(!sessionOtp.equals(otp)) {

            model.addAttribute("error", "Invalid OTP");

            return "verify-otp";
        }

        return "reset-password";
    }

    // ================= RESET PASSWORD =================

    @GetMapping("/reset-password")
    public String resetPasswordPage() {

        return "reset-password";
    }

    @PostMapping("/reset-password")
    public String resetPassword(ResetPasswordRequest request,
                                HttpSession session,
                                Model model) {

        if(!request.getPassword().equals(request.getConfirmPassword())) {

            model.addAttribute("error",
                    "Passwords do not match");

            return "reset-password";
        }

        String email = (String) session.getAttribute("resetEmail");

        userService.resetPassword(email, request.getPassword());

        session.removeAttribute("otp");
        session.removeAttribute("otpTime");
        session.removeAttribute("resetEmail");

        model.addAttribute("success",
                "Password Reset Successfully. Please Login.");

        return "login";
    }

    // ================= RESEND OTP =================

    @PostMapping("/resend-otp")
    public String resendOtp(HttpSession session,
                            Model model) {

        String email = (String) session.getAttribute("resetEmail");

        if(email == null) {

            return "redirect:/forgot-password";
        }

        String otp = otpService.generateOtp();

        session.setAttribute("otp", otp);
        session.setAttribute("otpTime", System.currentTimeMillis());

        emailService.sendOtp(email, otp);

        model.addAttribute("success",
                "New OTP Sent Successfully");

        return "redirect:/verify-otp";
    }

}