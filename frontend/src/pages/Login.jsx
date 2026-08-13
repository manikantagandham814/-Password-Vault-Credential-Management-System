import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/auth/auth.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    // =====================================================
    // LOGIN
    // =====================================================

    async function handleLogin(e) {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8082/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            if (response.ok) {

                const data = await response.json();

                console.log("Login successful:", data);

                setSuccess("Login successful!");

                navigate("/dashboard");

            } else {

                let message = "Invalid email or password";

                try {

                    const text = await response.text();

                    if (text) {
                        message = text;
                    }

                } catch (error) {

                    console.error(
                        "Error reading login response:",
                        error
                    );
                }

                setError(message);

            }

        } catch (error) {

            console.error(
                "Login error:",
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
                    Password Vault Login
                </h2>


                {/* Success */}

                {success && (

                    <p className="success">
                        {success}
                    </p>

                )}


                {/* Error */}

                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {/* Login Form */}

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                        autoComplete="email"
                    />


                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        autoComplete="current-password"
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>


                    {/* Forgot Password */}

                    <p>

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>

                    </p>

                </form>


                {/* Register */}

                <p>

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create Account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;