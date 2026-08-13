import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/passwords/add-password.css";

function AddPassword() {

    const navigate = useNavigate();

    const [websiteName, setWebsiteName] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [category, setCategory] = useState("Personal");
    const [notes, setNotes] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    // =====================================================
    // Generate Password
    // =====================================================

    function generatePassword() {

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789@#$%&*!";

        let generatedPassword = "";

        for (let i = 0; i < 14; i++) {

            const index = Math.floor(
                Math.random() * characters.length
            );

            generatedPassword += characters[index];
        }

        setPassword(generatedPassword);

        setShowPassword(true);
    }


    // =====================================================
    // Save Password
    // =====================================================

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8082/api/passwords",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        websiteName,
                        websiteUrl,
                        username,
                        password,
                        category,
                        notes
                    })
                }
            );


            if (response.status === 401) {

                navigate("/login");

                return;
            }


            if (!response.ok) {

                const message =
                    await response.text();

                setError(
                    message || "Unable to save password"
                );

                return;
            }


            setSuccess(
                "Password saved successfully"
            );


            setTimeout(() => {

                navigate("/passwords");

            }, 800);


        } catch (error) {

            console.error(
                "Add password error:",
                error
            );

            setError(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="add-password-page">

            <div className="container">

                <div className="card">

                    <h2>

                        <i className="fa-solid fa-key"></i>

                        Add New Password

                    </h2>


                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}


                    {success && (
                        <p className="success">
                            {success}
                        </p>
                    )}


                    <form onSubmit={handleSubmit}>


                        {/* Website Name */}

                        <div className="input-group">

                            <label>
                                Website Name
                            </label>

                            <input
                                type="text"
                                name="websiteName"
                                placeholder="Google"
                                value={websiteName}
                                onChange={(e) =>
                                    setWebsiteName(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* Website URL */}

                        <div className="input-group">

                            <label>
                                Website URL
                            </label>

                            <input
                                type="url"
                                name="websiteUrl"
                                placeholder="https://google.com"
                                value={websiteUrl}
                                onChange={(e) =>
                                    setWebsiteUrl(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* Username */}

                        <div className="input-group">

                            <label>
                                Username / Email
                            </label>

                            <input
                                type="text"
                                name="username"
                                placeholder="abc@gmail.com"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="input-group">

                            <label>
                                Password
                            </label>


                            <div className="password-box">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                />


                                <button
                                    type="button"
                                    className="show-password-btn"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                >

                                    <i
                                        className={
                                            showPassword
                                                ? "fa-solid fa-eye-slash"
                                                : "fa-solid fa-eye"
                                        }
                                    ></i>

                                   

                                </button>


                                <button
                                    type="button"
                                    className="generate-password-btn"
                                    onClick={
                                        generatePassword
                                    }
                                >
                                    Generate Password
                                </button>

                            </div>

                        </div>


                        {/* Category */}

                        <div className="input-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Personal">
                                    Personal
                                </option>

                                <option value="Work">
                                    Work
                                </option>

                                <option value="Social">
                                    Social
                                </option>

                                <option value="Finance">
                                    Finance
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* Notes */}

                        <div className="input-group">

                            <label>
                                Notes
                            </label>

                            <textarea
                                name="notes"
                                placeholder="Add notes (optional)"
                                value={notes}
                                onChange={(e) =>
                                    setNotes(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* Save */}

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >

                            <i className="fa-solid fa-floppy-disk"></i>

                            {loading
                                ? "Saving..."
                                : "Save Password"
                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default AddPassword;