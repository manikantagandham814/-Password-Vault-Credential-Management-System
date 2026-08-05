package com.example.PasswordVault.util;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class AESUtil {

    private static final String SECRET_KEY =
            "PasswordVault123";

    private static final String ALGORITHM =
            "AES";

    public static String encrypt(String password) {

        try {

            SecretKeySpec key =
                    new SecretKeySpec(
                            SECRET_KEY.getBytes(),
                            ALGORITHM);

            Cipher cipher =
                    Cipher.getInstance(ALGORITHM);

            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] encrypted =
                    cipher.doFinal(password.getBytes());

            return Base64.getEncoder()
                    .encodeToString(encrypted);

        }

        catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

    public static String decrypt(String encryptedPassword) {

        try {

            SecretKeySpec key =
                    new SecretKeySpec(
                            SECRET_KEY.getBytes(),
                            ALGORITHM);

            Cipher cipher =
                    Cipher.getInstance(ALGORITHM);

            cipher.init(Cipher.DECRYPT_MODE, key);

            byte[] decoded =
                    Base64.getDecoder()
                            .decode(encryptedPassword);

            return new String(cipher.doFinal(decoded));

        }

        catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

}