package com.example.PasswordVault.dto;

public class PasswordHealthResponse {

    private long totalCredentials;

    private long strongPasswords;

    private long mediumPasswords;

    private long weakPasswords;

    private int healthScore;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PasswordHealthResponse() {
    }


    public PasswordHealthResponse(
            long totalCredentials,
            long strongPasswords,
            long mediumPasswords,
            long weakPasswords,
            int healthScore) {

        this.totalCredentials = totalCredentials;
        this.strongPasswords = strongPasswords;
        this.mediumPasswords = mediumPasswords;
        this.weakPasswords = weakPasswords;
        this.healthScore = healthScore;
    }


    // =====================================================
    // GETTERS
    // =====================================================

    public long getTotalCredentials() {
        return totalCredentials;
    }


    public long getStrongPasswords() {
        return strongPasswords;
    }


    public long getMediumPasswords() {
        return mediumPasswords;
    }


    public long getWeakPasswords() {
        return weakPasswords;
    }


    public int getHealthScore() {
        return healthScore;
    }


    // =====================================================
    // SETTERS
    // =====================================================

    public void setTotalCredentials(
            long totalCredentials) {

        this.totalCredentials = totalCredentials;
    }


    public void setStrongPasswords(
            long strongPasswords) {

        this.strongPasswords = strongPasswords;
    }


    public void setMediumPasswords(
            long mediumPasswords) {

        this.mediumPasswords = mediumPasswords;
    }


    public void setWeakPasswords(
            long weakPasswords) {

        this.weakPasswords = weakPasswords;
    }


    public void setHealthScore(
            int healthScore) {

        this.healthScore = healthScore;
    }
}