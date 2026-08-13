import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import "../styles/password-details/view-password.css";


function ViewPassword() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] = useState(null);

    const [loading, setLoading] = useState(true);

    const [showPassword, setShowPassword] = useState(false);


    // =====================================================
    // Load Password
    // =====================================================

    useEffect(() => {

        async function loadPassword() {

            try {

                const response = await fetch(
                    `http://localhost:8082/api/passwords/${id}/view`,
                    {
                        method: "GET",

                        credentials: "include"
                    }
                );


                // =================================================
                // Unauthorized
                // =================================================

                if (response.status === 401) {

                    navigate("/login");

                    return;
                }


                // =================================================
                // Forbidden
                // =================================================

                if (response.status === 403) {

                    alert("Access denied");

                    navigate("/passwords");

                    return;
                }


                // =================================================
                // Not Found
                // =================================================

                if (response.status === 404) {

                    navigate("/passwords");

                    return;
                }


                // =================================================
                // Other Error
                // =================================================

                if (!response.ok) {

                    throw new Error(
                        "Unable to load password"
                    );
                }


                // =================================================
                // Response
                // =================================================

                const data =
                    await response.json();

                setPassword(data);


            } catch (error) {

                console.error(
                    "View password error:",
                    error
                );

                alert(
                    "Unable to load password"
                );

                navigate("/passwords");

            } finally {

                setLoading(false);
            }
        }


        if (id) {

            loadPassword();

        } else {

            navigate("/passwords");

            setLoading(false);
        }

    }, [id, navigate]);


    // =====================================================
    // Copy Password
    // =====================================================

    async function copyPassword() {

        if (!password?.password) {

            return;
        }


        try {

            await navigator.clipboard.writeText(
                password.password
            );

            alert("Password Copied!");


        } catch (error) {

            console.error(
                "Copy error:",
                error
            );

            alert(
                "Unable to copy password"
            );
        }
    }


    // =====================================================
    // Loading
    // =====================================================

    if (loading) {

        return (

            <div className="view-password-page">

                <div className="card">

                    <h2>

                        <i className="fa-solid fa-lock"></i>

                        Loading Password...

                    </h2>

                </div>

            </div>
        );
    }


    // =====================================================
    // No Password
    // =====================================================

    if (!password) {

        return null;
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="view-password-page">

            <div className="card">


                {/* =================================================
                    HEADING
                ================================================= */}

                <h2>

                    <i className="fa-solid fa-lock"></i>

                    Password Details

                </h2>


                {/* =================================================
                    WEBSITE
                ================================================= */}

                <div className="row">

                    <label htmlFor="websiteName">
                        Website
                    </label>

                    <p id="websiteName">
                        {password.websiteName || "-"}
                    </p>

                </div>


                {/* =================================================
                    WEBSITE URL
                ================================================= */}

                <div className="row">

                    <label htmlFor="websiteUrl">
                        Website URL
                    </label>

                    <p id="websiteUrl">
                        {password.websiteUrl || "-"}
                    </p>

                </div>


                {/* =================================================
                    USERNAME
                ================================================= */}

                <div className="row">

                    <label htmlFor="username">
                        Username
                    </label>

                    <p id="username">
                        {password.username || "-"}
                    </p>

                </div>


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div className="row">

                    <label htmlFor="password">
                        Password
                    </label>


                    <div className="password-box">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            id="password"

                            value={
                                password.password || ""
                            }

                            readOnly

                            aria-label="Password"
                        />


                        <button
                            type="button"

                            onClick={() =>
                                setShowPassword(
                                    (value) =>
                                        !value
                                )
                            }

                            title={
                                showPassword
                                    ? "Hide Password"
                                    : "Show Password"
                            }

                            aria-label={
                                showPassword
                                    ? "Hide Password"
                                    : "Show Password"
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

                    </div>

                </div>


                {/* =================================================
                    CATEGORY
                ================================================= */}

                <div className="row">

                    <label htmlFor="category">
                        Category
                    </label>

                    <p id="category">
                        {password.category || "-"}
                    </p>

                </div>


                {/* =================================================
                    NOTES
                ================================================= */}

                <div className="row">

                    <label htmlFor="notes">
                        Notes
                    </label>

                    <p id="notes">
                        {password.notes || "-"}
                    </p>

                </div>


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="buttons">

                    <button
                        type="button"
                        onClick={copyPassword}
                    >

                        <i className="fa-solid fa-copy"></i>

                        {" "}Copy Password

                    </button>


                    <Link to="/passwords">

                        Back

                    </Link>

                </div>

            </div>

        </div>
    );
}


export default ViewPassword;