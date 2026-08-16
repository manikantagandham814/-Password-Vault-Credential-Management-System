package com.example.PasswordVault.service;

import java.util.List;

import com.example.PasswordVault.dto.SharePasswordRequest;
import com.example.PasswordVault.dto.SharedPasswordResponse;
import com.example.PasswordVault.dto.SharedPasswordSummaryResponse;
import com.example.PasswordVault.dto.UpdateSharePermissionRequest;
import com.example.PasswordVault.entity.User;

public interface PasswordShareService {


    void sharePassword(
            SharePasswordRequest request,
            User currentUser);


    List<SharedPasswordSummaryResponse>
    getInbox(User currentUser);


    List<SharedPasswordSummaryResponse>
    getSent(User currentUser);


    SharedPasswordResponse
    getSharedPassword(
            Long shareId,
            User currentUser);


    List<SharedPasswordSummaryResponse>
    getPasswordShares(
            Long passwordId,
            User currentUser);


    void updatePermission(
            Long shareId,
            UpdateSharePermissionRequest request,
            User currentUser);


    void removeShare(
            Long shareId,
            User currentUser);


    void deleteSharedPassword(
            Long shareId,
            User currentUser);
}