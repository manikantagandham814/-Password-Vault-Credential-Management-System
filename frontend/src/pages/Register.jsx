import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/auth/auth.css";

function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // =====================================================
    // REGISTER
    // =====================================================

    async function handleRegister(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8082/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        fullName: fullName,
                        email: email,
                        password: password
                    })
                }
            );


            if (response.ok) {

                navigate("/login");

            } else {

                let message =
                    "Registration failed";

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
                "Registration error:",
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
                    Create Account
                </h2>


                {/* Error */}

                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {/* Register Form */}

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                        required
                        autoComplete="name"
                    />


                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        autoComplete="new-password"
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Registering..."
                            : "Register"
                        }

                    </button>

                </form>


                {/* Login */}

                <p>

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;