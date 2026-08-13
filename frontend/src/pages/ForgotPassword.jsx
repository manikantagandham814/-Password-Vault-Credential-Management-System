import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/auth/auth.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // =====================================================
    // SEND OTP
    // =====================================================

    async function handleForgotPassword(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8082/api/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email: email
                    })
                }
            );


            if (response.ok) {

                navigate("/verify-otp");

            } else {

                let message =
                    "Unable to send OTP";

                try {

                    const text =
                        await response.text();

                    if (text) {
                        message = text;
                    }

                } catch (error) {

                    console.error(
                        "Error reading response:",
                        error
                    );
                }

                setError(message);
            }

        } catch (error) {

            console.error(
                "Forgot password error:",
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
                    Forgot Password
                </h2>


                {/* Error */}

                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {/* Forgot Password Form */}

                <form onSubmit={handleForgotPassword}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Registered Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                        autoComplete="email"
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Sending..."
                            : "Send OTP"
                        }

                    </button>

                </form>


                <p>

                    <Link to="/login">
                        Back to Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default ForgotPassword;