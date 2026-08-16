package com.example.PasswordVault.dto;

public class SharedPasswordResponse {

    private Long shareId;

    private Long passwordId;

    private String websiteName;

    private String websiteUrl;

    private String username;

    private String password;

    private String category;

    private String notes;

    private String permission;

    private String sharedByName;

    private String sharedByEmail;


    public SharedPasswordResponse(
            Long shareId,
            Long passwordId,
            String websiteName,
            String websiteUrl,
            String username,
            String password,
            String category,
            String notes,
            String permission,
            String sharedByName,
            String sharedByEmail) {

        this.shareId = shareId;
        this.passwordId = passwordId;
        this.websiteName = websiteName;
        this.websiteUrl = websiteUrl;
        this.username = username;
        this.password = password;
        this.category = category;
        this.notes = notes;
        this.permission = permission;
        this.sharedByName = sharedByName;
        this.sharedByEmail = sharedByEmail;
    }


    public Long getShareId() {
        return shareId;
    }

    public Long getPasswordId() {
        return passwordId;
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

    public String getPermission() {
        return permission;
    }

    public String getSharedByName() {
        return sharedByName;
    }

    public String getSharedByEmail() {
        return sharedByEmail;
    }
}