package com.example.PasswordVault.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.PasswordVault.dto.PasswordHealthResponse;
import com.example.PasswordVault.entity.Password;
import com.example.PasswordVault.entity.User;
import com.example.PasswordVault.repository.PasswordRepository;
import com.example.PasswordVault.util.AESUtil;

@Service
public class PasswordHealthService {

    private final PasswordRepository passwordRepository;

    private final PasswordStrengthService passwordStrengthService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PasswordHealthService(
            PasswordRepository passwordRepository,
            PasswordStrengthService passwordStrengthService) {

        this.passwordRepository = passwordRepository;

        this.passwordStrengthService =
                passwordStrengthService;
    }


    // =====================================================
    // PASSWORD HEALTH REPORT
    // =====================================================

    public PasswordHealthResponse
    getPasswordHealth(User user) {

        // Get all passwords belonging to
        // the currently logged-in user

        List<Password> passwords =
                passwordRepository.findByUser(user);


        long totalCredentials =
                passwords.size();

        long strongPasswords = 0;

        long mediumPasswords = 0;

        long weakPasswords = 0;


        // =================================================
        // ANALYZE EACH PASSWORD
        // =================================================

        for (Password password : passwords) {

            try {

                // -----------------------------------------
                // Decrypt stored password
                // -----------------------------------------

                String decryptedPassword =
                        AESUtil.decrypt(
                                password.getEncryptedPassword()
                        );


                // -----------------------------------------
                // Use Password Strength Checker
                // -----------------------------------------

                String strength =
                        passwordStrengthService
                                .checkStrength(
                                        decryptedPassword
                                );


                // -----------------------------------------
                // Count strength
                // -----------------------------------------

                if ("STRONG".equalsIgnoreCase(strength)) {

                    strongPasswords++;

                }

                else if ("MEDIUM".equalsIgnoreCase(strength)) {

                    mediumPasswords++;

                }

                else {

                    weakPasswords++;

                }

            }

            catch (Exception e) {

                /*
                 * If a password cannot be decrypted,
                 * treat it as weak for health reporting.
                 *
                 * We do NOT expose the password or
                 * encrypted value in the response.
                 */

                weakPasswords++;

            }
        }


        // =================================================
        // CALCULATE HEALTH SCORE
        // =================================================

        int healthScore = 0;


        if (totalCredentials > 0) {

            /*
             * Strong  = 100 points
             * Medium  = 60 points
             * Weak    = 20 points
             */

            double score =
                    (
                        (strongPasswords * 100.0) +
                        (mediumPasswords * 60.0) +
                        (weakPasswords * 20.0)
                    )
                    / totalCredentials;


            healthScore =
                    (int) Math.round(score);


            // Keep score between 0 and 100

            healthScore =
                    Math.max(
                            0,
                            Math.min(
                                    100,
                                    healthScore
                            )
                    );
        }


        // =================================================
        // CREATE RESPONSE
        // =================================================

        return new PasswordHealthResponse(

                totalCredentials,

                strongPasswords,

                mediumPasswords,

                weakPasswords,

                healthScore

        );
    }
}