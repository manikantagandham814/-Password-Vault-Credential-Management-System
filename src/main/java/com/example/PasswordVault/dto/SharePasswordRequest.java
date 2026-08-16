package com.example.PasswordVault.dto;

public class SharePasswordRequest {

    private Long passwordId;

    private String recipientEmail;

    private String permission;


    public SharePasswordRequest() {
    }


    public Long getPasswordId() {
        return passwordId;
    }

    public void setPasswordId(Long passwordId) {
        this.passwordId = passwordId;
    }


    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(
            String recipientEmail) {

        this.recipientEmail = recipientEmail;
    }


    public String getPermission() {
        return permission;
    }

    public void setPermission(
            String permission) {

        this.permission = permission;
    }
}