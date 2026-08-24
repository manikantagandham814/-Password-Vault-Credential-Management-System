import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../styles/sharing/shared-password.css";

function SharedPassword() {

    const { shareId } = useParams();

    const navigate = useNavigate();

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD SHARED PASSWORD
    // =====================================================

    useEffect(() => {

        async function load() {

            try {

                const response =
                    await fetch(
                        `http://localhost:8082/api/shares/${shareId}`,
                        {
                            method: "GET",
                            credentials: "include"
                        }
                    );


                if (response.status === 401) {

                    navigate("/login");

                    return;
                }


                if (response.status === 403) {

                    setError(
                        "You do not have access to this password."
                    );

                    return;
                }


                if (!response.ok) {

                    const message =
                        await response.text();

                    setError(
                        message ||
                        "Unable to load shared password"
                    );

                    return;
                }


                const result =
                    await response.json();


                setData(result);


            } catch (error) {

                console.error(
                    "Shared password error:",
                    error
                );


                setError(
                    "Unable to load shared password"
                );


            } finally {

                setLoading(false);

            }

        }


        load();

    }, [shareId, navigate]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="shared-password-page">

                <div className="card">

                    <h2>
                        Loading...
                    </h2>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="shared-password-page">

                <div className="card">

                    <h2>
                        Access Denied
                    </h2>


                    <p className="error">
                        {error}
                    </p>


                    <div className="buttons">

                        <Link to="/inbox">

                            <i className="fa-solid fa-arrow-left"></i>

                            {" "}Back to Inbox

                        </Link>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // NO DATA
    // =====================================================

    if (!data) {

        return null;

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="shared-password-page">

            <div className="card">


                {/* =================================================
                    HEADER
                ================================================= */}

                <h2>

                    <i className="fa-solid fa-share-nodes"></i>

                    Shared Password

                </h2>


                {/* =================================================
                    WEBSITE
                ================================================= */}

                <div className="row">

                    <label>
                        Website
                    </label>

                    <p>
                        {data.websiteName}
                    </p>

                </div>


                {/* =================================================
                    WEBSITE URL
                ================================================= */}

                <div className="row">

                    <label>
                        Website URL
                    </label>

                    <p>

                        {data.websiteUrl ? (

                            <a
                                href={data.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {data.websiteUrl}
                            </a>

                        ) : (

                            "-"
                        )}

                    </p>

                </div>


                {/* =================================================
                    USERNAME
                ================================================= */}

                <div className="row">

                    <label>
                        Username
                    </label>

                    <p>
                        {data.username}
                    </p>

                </div>


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div className="row">

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
                            value={
                                data.password || ""
                            }
                            readOnly
                        />


                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    value =>
                                        !value
                                )
                            }
                            title={
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

                    <label>
                        Category
                    </label>

                    <p>
                        {data.category || "-"}
                    </p>

                </div>


                {/* =================================================
                    NOTES
                ================================================= */}

                <div className="row">

                    <label>
                        Notes
                    </label>

                    <p>
                        {data.notes || "-"}
                    </p>

                </div>


                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <div className="buttons">

                    <Link to="/inbox">

                        <i className="fa-solid fa-arrow-left"></i>

                        {" "}Back to Inbox

                    </Link>

                </div>

            </div>

        </div>

    );

}

export default SharedPassword;