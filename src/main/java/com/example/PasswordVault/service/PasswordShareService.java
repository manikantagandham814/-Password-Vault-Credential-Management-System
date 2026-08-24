package com.example.PasswordVault.service;

import java.util.List;

import com.example.PasswordVault.dto.SharePasswordRequest;
import com.example.PasswordVault.dto.SharedPasswordResponse;
import com.example.PasswordVault.dto.SharedPasswordSummaryResponse;
import com.example.PasswordVault.dto.UpdateSharePermissionRequest;
import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;

public interface PasswordShareService {


    // =====================================================
    // SHARE PASSWORD
    // =====================================================

    void sharePassword(
            SharePasswordRequest request,
            User currentUser);


    // =====================================================
    // INBOX
    // =====================================================

    List<SharedPasswordSummaryResponse>
    getInbox(User currentUser);


    // =====================================================
    // SENT
    // =====================================================

    List<SharedPasswordSummaryResponse>
    getSent(User currentUser);


    // =====================================================
    // VIEW SHARED PASSWORD
    // =====================================================

    SharedPasswordResponse
    getSharedPassword(
            Long shareId,
            User currentUser);


    // =====================================================
    // GET SHARES FOR PASSWORD
    // =====================================================

    List<SharedPasswordSummaryResponse>
    getPasswordShares(
            Long passwordId,
            User currentUser);


    // =====================================================
    // UPDATE SHARE PERMISSION
    // =====================================================

    void updatePermission(
            Long shareId,
            UpdateSharePermissionRequest request,
            User currentUser);


    // =====================================================
    // REMOVE SHARE
    // =====================================================

    void removeShare(
            Long shareId,
            User currentUser);


    // =====================================================
    // DELETE SHARED PASSWORD
    // =====================================================

    void deleteSharedPassword(
            Long shareId,
            User currentUser);


    // =====================================================
    // PERMISSION CHECKS
    // =====================================================

    boolean canView(
            Password password,
            User currentUser);


    boolean canEdit(
            Password password,
            User currentUser);


    boolean canDelete(
            Password password,
            User currentUser);


    boolean canManageSharing(
            Password password,
            User currentUser);
}