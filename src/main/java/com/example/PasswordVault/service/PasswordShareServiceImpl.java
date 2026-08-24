package com.example.PasswordVault.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PasswordVault.dto.SharePasswordRequest;
import com.example.PasswordVault.dto.SharedPasswordResponse;
import com.example.PasswordVault.dto.SharedPasswordSummaryResponse;
import com.example.PasswordVault.dto.UpdateSharePermissionRequest;
import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.PasswordShare;
import com.example.PasswordVault.entity.SharePermission;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.PasswordRepository;
import com.example.PasswordVault.repository.PasswordShareRepository;
import com.example.PasswordVault.repository.UserRepository;
import com.example.PasswordVault.util.AESUtil;

@Service
public class PasswordShareServiceImpl
        implements PasswordShareService {


    @Autowired
    private PasswordShareRepository shareRepository;

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;


    // =====================================================
    // SHARE PASSWORD
    // =====================================================

    @Override
    @Transactional
    public void sharePassword(
            SharePasswordRequest request,
            User currentUser) {

        if (request.getPasswordId() == null) {

            throw new IllegalArgumentException(
                    "Password ID is required");
        }

        if (request.getRecipientEmail() == null ||
                request.getRecipientEmail()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Recipient email is required");
        }

        if (request.getPermission() == null ||
                request.getPermission()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Permission is required");
        }


        Password password =
                passwordRepository
                        .findById(request.getPasswordId())
                        .orElse(null);


        if (password == null) {

            throw new IllegalArgumentException(
                    "Password not found");
        }


        // Owner OR FULL_MANAGEMENT user can share.

        if (!canManageSharing(
                password,
                currentUser)) {

            throw new SecurityException(
                    "You do not have permission to share this password");
        }


        User recipient =
                userRepository
                        .findByEmail(
                                request.getRecipientEmail()
                                        .trim()
                        )
                        .orElse(null);


        if (recipient == null) {

            throw new IllegalArgumentException(
                    "Recipient user not found");
        }


        // Cannot share with yourself.

        if (recipient.getId()
                .equals(currentUser.getId())) {

            throw new IllegalArgumentException(
                    "You cannot share a password with yourself");
        }


        SharePermission permission =
                parsePermission(
                        request.getPermission()
                );


        // Prevent duplicate share.

        if (shareRepository
                .findByPasswordAndRecipient(
                        password,
                        recipient
                )
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Password is already shared with this user");
        }


        PasswordShare share =
                new PasswordShare();


        share.setPassword(password);
        share.setSharedBy(currentUser);
        share.setRecipient(recipient);
        share.setPermission(permission);

        share.setCreatedAt(
                LocalDateTime.now()
        );

        share.setUpdatedAt(
                LocalDateTime.now()
        );


        shareRepository.save(share);
    }


    // =====================================================
    // INBOX
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<SharedPasswordSummaryResponse>
    getInbox(User currentUser) {

        return shareRepository
                .findByRecipientOrderByCreatedAtDesc(
                        currentUser
                )
                .stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }


    // =====================================================
    // SENT
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<SharedPasswordSummaryResponse>
    getSent(User currentUser) {

        return shareRepository
                .findBySharedByOrderByCreatedAtDesc(
                        currentUser
                )
                .stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }


    // =====================================================
    // VIEW SHARED PASSWORD
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public SharedPasswordResponse
    getSharedPassword(
            Long shareId,
            User currentUser) {

        PasswordShare share =
                getShare(shareId);


        Password password =
                share.getPassword();


        boolean owner =
                password.getUser()
                        .getId()
                        .equals(currentUser.getId());


        boolean recipient =
                share.getRecipient()
                        .getId()
                        .equals(currentUser.getId());


        boolean sharedBy =
                share.getSharedBy()
                        .getId()
                        .equals(currentUser.getId());


        if (!owner && !recipient && !sharedBy) {

            throw new SecurityException(
                    "Access denied");
        }


        String decryptedPassword =
                AESUtil.decrypt(
                        password.getEncryptedPassword()
                );


        return new SharedPasswordResponse(
                share.getId(),
                password.getId(),
                password.getWebsiteName(),
                password.getWebsiteUrl(),
                password.getUsername(),
                decryptedPassword,
                password.getCategory(),
                password.getNotes(),
                share.getPermission().name(),
                share.getSharedBy().getFullName(),
                share.getSharedBy().getEmail()
        );
    }


    // =====================================================
    // MANAGE SHARES FOR PASSWORD
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<SharedPasswordSummaryResponse>
    getPasswordShares(
            Long passwordId,
            User currentUser) {

        Password password =
                passwordRepository
                        .findById(passwordId)
                        .orElse(null);


        if (password == null) {

            throw new IllegalArgumentException(
                    "Password not found");
        }


        if (!canManageSharing(
                password,
                currentUser)) {

            throw new SecurityException(
                    "You do not have permission to manage sharing");
        }


        return shareRepository
                .findByPasswordOrderByCreatedAtDesc(
                        password
                )
                .stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }


    // =====================================================
    // UPDATE PERMISSION
    // =====================================================

    @Override
    @Transactional
    public void updatePermission(
            Long shareId,
            UpdateSharePermissionRequest request,
            User currentUser) {

        PasswordShare share =
                getShare(shareId);


        Password password =
                share.getPassword();


        if (!canManageSharing(
                password,
                currentUser)) {

            throw new SecurityException(
                    "You do not have permission to change permission");
        }


        if (request.getPermission() == null ||
                request.getPermission()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Permission is required");
        }


        SharePermission permission =
                parsePermission(
                        request.getPermission()
                );


        share.setPermission(permission);

        share.setUpdatedAt(
                LocalDateTime.now()
        );


        shareRepository.save(share);
    }


    // =====================================================
    // REMOVE SHARE
    // =====================================================

    @Override
    @Transactional
    public void removeShare(
            Long shareId,
            User currentUser) {

        PasswordShare share =
                getShare(shareId);


        Password password =
                share.getPassword();


        if (!canManageSharing(
                password,
                currentUser)) {

            throw new SecurityException(
                    "You do not have permission to remove this share");
        }


        shareRepository.delete(share);
    }


    // =====================================================
    // DELETE ORIGINAL PASSWORD
    // FULL MANAGEMENT
    // =====================================================

    @Override
    @Transactional
    public void deleteSharedPassword(
            Long shareId,
            User currentUser) {

        PasswordShare share =
                getShare(shareId);


        Password password =
                share.getPassword();


        boolean owner =
                password.getUser()
                        .getId()
                        .equals(currentUser.getId());


        boolean fullManagement =
                share.getRecipient()
                        .getId()
                        .equals(currentUser.getId())
                &&
                share.getPermission()
                        == SharePermission.FULL_MANAGEMENT;


        if (!owner && !fullManagement) {

            throw new SecurityException(
                    "Delete permission denied");
        }


        passwordRepository.delete(password);
    }


    // =====================================================
    // CHECK VIEW ACCESS
    // =====================================================

    public boolean canView(
            Password password,
            User currentUser) {

        if (password.getUser()
                .getId()
                .equals(currentUser.getId())) {

            return true;
        }


        return shareRepository
                .findByPasswordAndRecipient(
                        password,
                        currentUser
                )
                .isPresent();
    }


    // =====================================================
    // CHECK EDIT ACCESS
    // =====================================================

    public boolean canEdit(
            Password password,
            User currentUser) {

        // Owner can always edit.

        if (password.getUser()
                .getId()
                .equals(currentUser.getId())) {

            return true;
        }


        PasswordShare share =
                shareRepository
                        .findByPasswordAndRecipient(
                                password,
                                currentUser
                        )
                        .orElse(null);


        if (share == null) {

            return false;
        }


        return share.getPermission()
                == SharePermission.EDIT
                ||
                share.getPermission()
                == SharePermission.FULL_MANAGEMENT;
    }


    // =====================================================
    // CHECK DELETE ACCESS
    // =====================================================

    public boolean canDelete(
            Password password,
            User currentUser) {

        // Owner can always delete.

        if (password.getUser()
                .getId()
                .equals(currentUser.getId())) {

            return true;
        }


        PasswordShare share =
                shareRepository
                        .findByPasswordAndRecipient(
                                password,
                                currentUser
                        )
                        .orElse(null);


        return share != null
                &&
                share.getPermission()
                        == SharePermission.FULL_MANAGEMENT;
    }


    // =====================================================
    // CHECK SHARE MANAGEMENT ACCESS
    // =====================================================

    public boolean canManageSharing(
            Password password,
            User currentUser) {

        // Owner always has full control.

        if (password.getUser()
                .getId()
                .equals(currentUser.getId())) {

            return true;
        }


        PasswordShare ownShare =
                shareRepository
                        .findByPasswordAndRecipient(
                                password,
                                currentUser
                        )
                        .orElse(null);


        return ownShare != null
                &&
                ownShare.getPermission()
                        == SharePermission.FULL_MANAGEMENT;
    }


    // =====================================================
    // GET SHARE
    // =====================================================

    private PasswordShare getShare(
            Long shareId) {

        PasswordShare share =
                shareRepository
                        .findById(shareId)
                        .orElse(null);


        if (share == null) {

            throw new IllegalArgumentException(
                    "Shared password not found");
        }


        return share;
    }


    // =====================================================
    // PERMISSION PARSER
    // =====================================================

    private SharePermission parsePermission(
            String value) {

        try {

            return SharePermission.valueOf(
                    value.trim()
                            .toUpperCase()
            );

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Invalid permission. Use VIEW_ONLY, EDIT or FULL_MANAGEMENT"
            );
        }
    }


    // =====================================================
    // SUMMARY DTO
    // =====================================================

    private SharedPasswordSummaryResponse
    toSummary(PasswordShare share) {

        Password password =
                share.getPassword();


        return new SharedPasswordSummaryResponse(

                share.getId(),

                password.getId(),

                password.getWebsiteName(),

                password.getWebsiteUrl(),

                password.getCategory(),

                share.getPermission().name(),

                share.getSharedBy().getFullName(),

                share.getSharedBy().getEmail(),

                share.getRecipient().getFullName(),

                share.getRecipient().getEmail()
        );
    }
}