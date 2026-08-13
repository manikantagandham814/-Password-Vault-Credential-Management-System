import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/auth/auth.css";

function ResetPassword() {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    async function handleReset(e) {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match"
            );

            return;
        }


        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8082/api/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        password: password,
                        confirmPassword: confirmPassword
                    })
                }
            );


            if (response.ok) {

                setSuccess(
                    "Password Reset Successfully. Please Login."
                );

                setPassword("");
                setConfirmPassword("");

                setTimeout(() => {

                    navigate("/login");

                }, 1200);

            } else {

                let message =
                    "Unable to reset password";

                try {

                    const text =
                        await response.text();

                    if (text) {
                        message = text;
                    }

                } catch (error) {

                    console.error(
                        "Error reading reset response:",
                        error
                    );
                }

                setError(message);
            }

        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            setError(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="auth-page">

            <div className="auth-container">

                <h2>
                    Reset Password
                </h2>


                {/* Error */}

                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {/* Success */}

                {success && (

                    <p className="success">
                        {success}
                    </p>

                )}


                <form onSubmit={handleReset}>

                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        autoComplete="new-password"
                        disabled={loading}
                    />


                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                        required
                        autoComplete="new-password"
                        disabled={loading}
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset Password"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default ResetPassword;