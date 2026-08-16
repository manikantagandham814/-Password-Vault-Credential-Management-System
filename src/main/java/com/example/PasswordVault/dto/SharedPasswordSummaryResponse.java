package com.example.PasswordVault.dto;

public class SharedPasswordSummaryResponse {

    private Long shareId;

    private Long passwordId;

    private String websiteName;

    private String websiteUrl;

    private String category;

    private String permission;

    private String sharedByName;

    private String sharedByEmail;

    private String recipientName;

    private String recipientEmail;


    public SharedPasswordSummaryResponse() {
    }


    public SharedPasswordSummaryResponse(
            Long shareId,
            Long passwordId,
            String websiteName,
            String websiteUrl,
            String category,
            String permission,
            String sharedByName,
            String sharedByEmail,
            String recipientName,
            String recipientEmail) {

        this.shareId = shareId;
        this.passwordId = passwordId;
        this.websiteName = websiteName;
        this.websiteUrl = websiteUrl;
        this.category = category;
        this.permission = permission;
        this.sharedByName = sharedByName;
        this.sharedByEmail = sharedByEmail;
        this.recipientName = recipientName;
        this.recipientEmail = recipientEmail;
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

    public String getCategory() {
        return category;
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

    public String getRecipientName() {
        return recipientName;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }
}