package com.example.PasswordVault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.dto.ForgotPasswordRequest;
import com.example.PasswordVault.dto.LoginRequest;
import com.example.PasswordVault.dto.RegisterRequest;
import com.example.PasswordVault.dto.ResetPasswordRequest;

import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.entity.LoginStatus;

import com.example.PasswordVault.service.EmailService;
import com.example.PasswordVault.service.OtpService;
import com.example.PasswordVault.service.UserService;
import com.example.PasswordVault.service.LoginHistoryService;
import com.example.PasswordVault.service.SuspiciousActivityService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private LoginHistoryService loginHistoryService;

    @Autowired
    private SuspiciousActivityService suspiciousActivityService;


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        boolean status =
                userService.loginUser(request);


        // =================================================
        // FAILED LOGIN
        // =================================================

        if (!status) {

            // ---------------------------------------------
            // Record failed login
            // ---------------------------------------------

            loginHistoryService.recordLoginAttempt(
                    request.getEmail(),
                    LoginStatus.FAILED
            );


            // ---------------------------------------------
            // Analyze suspicious activity
            // ---------------------------------------------

            suspiciousActivityService
                    .analyzeLoginActivity(
                            request.getEmail()
                    );


            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid Email or Password"
                    );
        }


        // =================================================
        // GET USER AFTER SUCCESSFUL LOGIN
        // =================================================

        User user =
                userService.getUserByEmail(
                        request.getEmail()
                );


        // =================================================
        // SUCCESSFUL LOGIN HISTORY
        // =================================================

        loginHistoryService.recordLoginAttempt(
                user.getEmail(),
                LoginStatus.SUCCESS
        );


        // =================================================
        // CREATE LOGIN SESSION
        // =================================================

        session.setAttribute(
                "email",
                user.getEmail()
        );

        session.setAttribute(
                "fullName",
                user.getFullName()
        );


        return ResponseEntity.ok(
                new LoginResponse(
                        "Login Successful",
                        user.getFullName()
                )
        );
    }


    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        String result =
                userService.registerUser(request);


        if (result.equals(
                "Registration Successful"
        )) {

            return ResponseEntity.ok(
                    result
            );
        }


        return ResponseEntity
                .badRequest()
                .body(result);
    }


    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request,
            HttpSession session) {

        String email =
                request.getEmail();


        if (!userService.emailExists(email)) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Email not registered"
                    );
        }


        String otp =
                otpService.generateOtp();


        session.setAttribute(
                "otp",
                otp
        );

        session.setAttribute(
                "resetEmail",
                email
        );

        session.setAttribute(
                "otpTime",
                System.currentTimeMillis()
        );

        session.setAttribute(
                "otpVerified",
                false
        );


        emailService.sendOtp(
                email,
                otp
        );


        return ResponseEntity.ok(
                "OTP sent successfully"
        );
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request,
            HttpSession session) {

        String sessionOtp =
                (String) session.getAttribute(
                        "otp"
                );


        Long otpTime =
                (Long) session.getAttribute(
                        "otpTime"
                );


        if (
                sessionOtp == null ||
                otpTime == null
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "OTP Expired"
                    );
        }


        long currentTime =
                System.currentTimeMillis();


        if (
                currentTime - otpTime >
                60000
        ) {

            session.removeAttribute("otp");

            session.removeAttribute("otpTime");


            return ResponseEntity
                    .badRequest()
                    .body(
                            "OTP Expired"
                    );
        }


        if (
                !sessionOtp.equals(
                        request.getOtp()
                )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid OTP"
                    );
        }


        session.setAttribute(
                "otpVerified",
                true
        );


        return ResponseEntity.ok(
                "OTP verified successfully"
        );
    }


    // =====================================================
    // RESEND OTP
    // =====================================================

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(
            HttpSession session) {

        String email =
                (String) session.getAttribute(
                        "resetEmail"
                );


        if (email == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Session expired"
                    );
        }


        String otp =
                otpService.generateOtp();


        session.setAttribute(
                "otp",
                otp
        );

        session.setAttribute(
                "otpTime",
                System.currentTimeMillis()
        );

        session.setAttribute(
                "otpVerified",
                false
        );


        emailService.sendOtp(
                email,
                otp
        );


        return ResponseEntity.ok(
                "New OTP sent successfully"
        );
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request,
            HttpSession session) {

        Boolean verified =
                (Boolean) session.getAttribute(
                        "otpVerified"
                );


        if (
                verified == null ||
                !verified
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "OTP verification required"
                    );
        }


        if (
                !request.getPassword()
                        .equals(
                                request.getConfirmPassword()
                        )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Passwords do not match"
                    );
        }


        String email =
                (String) session.getAttribute(
                        "resetEmail"
                );


        if (email == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Session expired"
                    );
        }


        userService.resetPassword(
                email,
                request.getPassword()
        );


        session.removeAttribute("otp");

        session.removeAttribute("otpTime");

        session.removeAttribute("resetEmail");

        session.removeAttribute("otpVerified");


        return ResponseEntity.ok(
                "Password Reset Successfully"
        );
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpSession session) {

        session.invalidate();


        return ResponseEntity.ok(
                "Logged out successfully"
        );
    }


    // =====================================================
    // LOGIN RESPONSE
    // =====================================================

    public static class LoginResponse {

        private String message;

        private String fullName;


        public LoginResponse(
                String message,
                String fullName) {

            this.message = message;

            this.fullName = fullName;
        }


        public String getMessage() {

            return message;
        }


        public String getFullName() {

            return fullName;
        }
    }


    // =====================================================
    // VERIFY OTP REQUEST
    // =====================================================

    public static class VerifyOtpRequest {

        private String otp;


        public VerifyOtpRequest() {
        }


        public String getOtp() {

            return otp;
        }


        public void setOtp(
                String otp) {

            this.otp = otp;
        }
    }
}