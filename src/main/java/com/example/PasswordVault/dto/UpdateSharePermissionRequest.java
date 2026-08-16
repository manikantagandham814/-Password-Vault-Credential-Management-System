package com.example.PasswordVault.dto;

public class UpdateSharePermissionRequest {

    private String permission;


    public UpdateSharePermissionRequest() {
    }


    public String getPermission() {
        return permission;
    }

    public void setPermission(
            String permission) {

        this.permission = permission;
    }
}