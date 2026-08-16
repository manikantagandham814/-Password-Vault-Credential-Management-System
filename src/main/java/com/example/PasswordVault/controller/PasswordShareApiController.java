package com.example.PasswordVault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PasswordVault.dto.SharePasswordRequest;
import com.example.PasswordVault.dto.SharedPasswordResponse;
import com.example.PasswordVault.dto.SharedPasswordSummaryResponse;
import com.example.PasswordVault.dto.UpdateSharePermissionRequest;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.service.PasswordShareService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/shares")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class PasswordShareApiController {


    @Autowired
    private PasswordShareService shareService;


    @Autowired
    private UserRepository userRepository;


    // =====================================================
    // SHARE PASSWORD
    // POST /api/shares
    // =====================================================

    @PostMapping
    public ResponseEntity<?> sharePassword(
            @RequestBody SharePasswordRequest request,
            HttpSession session) {

        User user = getLoggedInUser(session);

        if (user == null) {
            return unauthorized();
        }


        try {

            shareService.sharePassword(
                    request,
                    user
            );

            return ResponseEntity.ok(
                    "Password shared successfully"
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // INBOX
    // GET /api/shares/inbox
    // =====================================================

    @GetMapping("/inbox")
    public ResponseEntity<?> inbox(
            HttpSession session) {

        User user = getLoggedInUser(session);

        if (user == null) {
            return unauthorized();
        }


        List<SharedPasswordSummaryResponse> result =
                shareService.getInbox(user);


        return ResponseEntity.ok(result);
    }


    // =====================================================
    // SENT
    // GET /api/shares/sent
    // =====================================================

    @GetMapping("/sent")
    public ResponseEntity<?> sent(
            HttpSession session) {

        User user = getLoggedInUser(session);

        if (user == null) {
            return unauthorized();
        }


        List<SharedPasswordSummaryResponse> result =
                shareService.getSent(user);


        return ResponseEntity.ok(result);
    }


    // =====================================================
    // VIEW SHARED PASSWORD
    // GET /api/shares/{shareId}
    // =====================================================

    @GetMapping("/{shareId}")
    public ResponseEntity<?> viewSharedPassword(
            @PathVariable Long shareId,
            HttpSession session) {

        User user = getLoggedInUser(session);

        if (user == null) {
            return unauthorized();
        }


        try {

            SharedPasswordResponse response =
                    shareService.getSharedPassword(
                            shareId,
                            user
                    );

            return ResponseEntity.ok(response);

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET SHARES FOR A PASSWORD
    //
    // GET /api/shares/password/{passwordId}
    // =====================================================

    @GetMapping("/password/{passwordId}")
    public ResponseEntity<?> getPasswordShares(
            @PathVariable Long passwordId,
            HttpSession session) {

        User user = getLoggedInUser(session);

        if (user == null) {
            return unauthorized();
        }


        try {

            List<SharedPasswordSummaryResponse> result =
                    shareService.getPasswordShares(
                            passwordId,
                            user
                    );

            return ResponseEntity.ok(result);

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // UPDATE PERMISSION
    //
    // PUT /api/shares/{shareId}
    // =====================================================

    @PutMapping("/{shareId}")
    public ResponseEntity<?> updatePermission(
            @PathVariable Long shareId,
            @RequestBody UpdateSharePermissionRequest request,
            HttpSession session) {

        User user = getLoggedInUser(session);

        if (user == null) {
            return unauthorized();
        }


        try {

            shareService.updatePermission(
                    shareId,
                    request,
                    user
            );

            return ResponseEntity.ok(
                    "Permission updated successfully"
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // REMOVE ACCESS
    //
    // DELETE /api/shares/{shareId}
    // =====================================================

    @DeleteMapping("/{shareId}")
    public ResponseEntity<?> removeShare(
            @PathVariable Long shareId,
            HttpSession session) {

        User user = getLoggedInUser(session);

        if (user == null) {
            return unauthorized();
        }


        try {

            shareService.removeShare(
                    shareId,
                    user
            );

            return ResponseEntity.ok(
                    "Access removed successfully"
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // DELETE SHARED PASSWORD
    //
    // DELETE /api/shares/{shareId}/password
    // =====================================================

    @DeleteMapping("/{shareId}/password")
    public ResponseEntity<?> deleteSharedPassword(
            @PathVariable Long shareId,
            HttpSession session) {

        User user = getLoggedInUser(session);

        if (user == null) {
            return unauthorized();
        }


        try {

            shareService.deleteSharedPassword(
                    shareId,
                    user
            );

            return ResponseEntity.ok(
                    "Password deleted successfully"
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // SESSION USER
    // =====================================================

    private User getLoggedInUser(
            HttpSession session) {

        String email =
                (String) session.getAttribute("email");


        if (email == null) {
            return null;
        }


        return userRepository
                .findByEmail(email)
                .orElse(null);
    }


    // =====================================================
    // UNAUTHORIZED
    // =====================================================

    private ResponseEntity<?> unauthorized() {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Please login first");
    }
}