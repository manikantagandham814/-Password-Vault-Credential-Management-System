package com.example.PasswordVault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.dto.PasswordRequest;
import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.PasswordService;
import com.example.PasswordVault.util.AESUtil;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/passwords")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class PasswordApiController {

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private UserRepository userRepository;


    // =====================================================
    // Get All Passwords
    // GET /api/passwords
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getPasswords(
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");

        if (email == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        List<Password> passwords =
                passwordService.getAllPasswords(user);

        return ResponseEntity.ok(passwords);
    }


    // =====================================================
    // Search Passwords
    // GET /api/passwords/search?keyword=google
    // =====================================================

    @GetMapping("/search")
    public ResponseEntity<?> searchPasswords(
            @RequestParam("keyword") String keyword,
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");

        if (email == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        List<Password> passwords =
                passwordService.searchPasswords(
                        user,
                        keyword
                );

        return ResponseEntity.ok(passwords);
    }


    // =====================================================
    // Add Password
    // POST /api/passwords
    // =====================================================

    @PostMapping
    public ResponseEntity<?> addPassword(
            @RequestBody PasswordRequest request,
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");

        if (email == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        passwordService.savePassword(
                request,
                user
        );

        return ResponseEntity.ok(
                "Password Saved Successfully"
        );
    }


    // =====================================================
    // View Password
    // GET /api/passwords/{id}/view
    // =====================================================

    @GetMapping("/{id}/view")
    public ResponseEntity<?> viewPassword(
            @PathVariable Long id,
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");

        if (email == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        Password password =
                passwordService.getPasswordById(id);

        if (password == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Password not found");
        }


        // Make sure this password belongs
        // to the logged-in user

        if (!password.getUser().getId()
                .equals(user.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied");
        }


        String decryptedPassword =
                AESUtil.decrypt(
                        password.getEncryptedPassword()
                );


        PasswordResponse response =
                new PasswordResponse(
                        password.getId(),
                        password.getWebsiteName(),
                        password.getWebsiteUrl(),
                        password.getUsername(),
                        decryptedPassword,
                        password.getCategory(),
                        password.getNotes()
                );


        return ResponseEntity.ok(response);
    }


    // =====================================================
    // Update Password
    // PUT /api/passwords/{id}
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long id,
            @RequestBody PasswordRequest request,
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");

        if (email == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        Password password =
                passwordService.getPasswordById(id);

        if (password == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Password not found");
        }


        // Make sure this password belongs
        // to the logged-in user

        if (!password.getUser().getId()
                .equals(user.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied");
        }


        passwordService.updatePassword(
                id,
                request
        );


        return ResponseEntity.ok(
                "Password Updated Successfully"
        );
    }


    // =====================================================
    // Delete Password
    // DELETE /api/passwords/{id}
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePassword(
            @PathVariable Long id,
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");

        if (email == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first");
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        Password password =
                passwordService.getPasswordById(id);

        if (password == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Password not found");
        }


        // Make sure this password belongs
        // to the logged-in user

        if (!password.getUser().getId()
                .equals(user.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied");
        }


        passwordService.deletePassword(id);


        return ResponseEntity.ok(
                "Password Deleted Successfully"
        );
    }


    // =====================================================
    // Response DTO for View Password
    // =====================================================

    public static class PasswordResponse {

        private Long id;

        private String websiteName;

        private String websiteUrl;

        private String username;

        private String password;

        private String category;

        private String notes;


        public PasswordResponse(
                Long id,
                String websiteName,
                String websiteUrl,
                String username,
                String password,
                String category,
                String notes) {

            this.id = id;
            this.websiteName = websiteName;
            this.websiteUrl = websiteUrl;
            this.username = username;
            this.password = password;
            this.category = category;
            this.notes = notes;
        }


        public Long getId() {
            return id;
        }

        public String getWebsiteName() {
            return websiteName;
        }

        public String getWebsiteUrl() {
            return websiteUrl;
        }

        public String getUsername() {
            return username;
        }

        public String getPassword() {
            return password;
        }

        public String getCategory() {
            return category;
        }

        public String getNotes() {
            return notes;
        }
    }
}