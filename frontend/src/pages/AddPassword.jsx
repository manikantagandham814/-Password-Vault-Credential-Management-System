import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/passwords/add-password.css";


function AddPassword() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");

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
    // LOAD USER PROFILE NAME
    // =====================================================

    useEffect(() => {

        async function loadUser() {

            try {

                const response = await fetch(
                    "http://localhost:8082/api/dashboard",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


                // Unauthorized session
                if (response.status === 401) {

                    navigate("/login");

                    return;
                }


                // Other server/API error
                if (!response.ok) {

                    setError(
                        "Unable to load your account information. Please try again."
                    );

                    return;
                }


                const data =
                    await response.json();


                if (!data.authenticated) {

                    navigate("/login");

                    return;
                }


                setFullName(
                    data.fullName || ""
                );


            } catch (err) {

                console.error(
                    "Profile loading error:",
                    err
                );

                setError(
                    "Unable to connect to server. Please try again."
                );
            }
        }


        loadUser();

    }, [navigate]);


    // =====================================================
    // GENERATE PASSWORD
    // =====================================================

    function generatePassword() {

        const uppercase =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const lowercase =
            "abcdefghijklmnopqrstuvwxyz";

        const numbers =
            "0123456789";

        const symbols =
            "@#$%&*!";

        const allCharacters =
            uppercase +
            lowercase +
            numbers +
            symbols;

        let generated = "";


        generated += uppercase[
            Math.floor(
                Math.random() * uppercase.length
            )
        ];


        generated += lowercase[
            Math.floor(
                Math.random() * lowercase.length
            )
        ];


        generated += numbers[
            Math.floor(
                Math.random() * numbers.length
            )
        ];


        generated += symbols[
            Math.floor(
                Math.random() * symbols.length
            )
        ];


        for (
            let i = generated.length;
            i < 14;
            i++
        ) {

            generated += allCharacters[
                Math.floor(
                    Math.random() *
                    allCharacters.length
                )
            ];
        }


        generated = generated
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");


        setPassword(generated);
        setShowPassword(true);
    }


    // =====================================================
    // SAVE PASSWORD
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


            // Unauthorized session
            if (response.status === 401) {

                navigate("/login");

                return;
            }


            if (!response.ok) {

                let message =
                    "Unable to save password. Please check your details and try again.";

                try {

                    const responseText =
                        await response.text();

                    if (responseText) {

                        message =
                            responseText;
                    }

                } catch (readError) {

                    console.error(
                        "Error reading save response:",
                        readError
                    );
                }


                /*
                 * Keep technical server errors away
                 * from the user interface.
                 */
                if (
                    message.includes("Exception") ||
                    message.includes("at org.") ||
                    message.includes("at java.") ||
                    message.includes("StackTrace") ||
                    message.includes("Error:")
                ) {

                    message =
                        "Unable to save password. Please try again.";
                }


                setError(message);

                return;
            }


            setSuccess(
                "Password saved successfully"
            );


            setTimeout(() => {

                navigate("/passwords");

            }, 800);


        } catch (err) {

            console.error(
                "Error saving password:",
                err
            );

            setError(
                "Unable to connect to server. Please try again."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Layout
            fullName={fullName}
            pageClassName="add-password-page"
        >

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

                        {/* WEBSITE NAME */}

                        <div className="input-group">

                            <label>
                                Website Name
                            </label>

                            <input
                                type="text"
                                value={websiteName}
                                onChange={(e) =>
                                    setWebsiteName(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* WEBSITE URL */}

                        <div className="input-group">

                            <label>
                                Website URL
                            </label>

                            <input
                                type="url"
                                value={websiteUrl}
                                onChange={(e) =>
                                    setWebsiteUrl(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* USERNAME */}

                        <div className="input-group">

                            <label>
                                Username / Email
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* PASSWORD */}

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
                                            !showPassword
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
                                    Generate
                                </button>

                            </div>

                        </div>


                        {/* CATEGORY */}

                        <div className="input-group">

                            <label>
                                Category
                            </label>

                            <select
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


                        {/* NOTES */}

                        <div className="input-group">

                            <label>
                                Notes
                            </label>

                            <textarea
                                value={notes}
                                onChange={(e) =>
                                    setNotes(
                                        e.target.value
                                    )
                                }
                            ></textarea>

                        </div>


                        {/* SAVE */}

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Save Password"}

                        </button>

                    </form>

                </div>

            </div>

        </Layout>
    );
}


export default AddPassword;