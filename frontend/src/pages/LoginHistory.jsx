import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/login-history.css";

function LoginHistory() {

    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);

    const [fullName, setFullName] = useState("");

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // CLOSE PROFILE DROPDOWN
    // =====================================================

    useEffect(() => {

        function handleDocumentClick() {

            setProfileOpen(false);

        }

        document.addEventListener(
            "click",
            handleDocumentClick
        );

        return () => {

            document.removeEventListener(
                "click",
                handleDocumentClick
            );

        };

    }, []);


    // =====================================================
    // LOAD LOGIN HISTORY
    // =====================================================

    useEffect(() => {

        let mounted = true;


        async function loadLoginHistory() {

            try {

                const response =
                    await fetch(
                        "http://localhost:8082/api/login-history",
                        {
                            method: "GET",
                            credentials: "include"
                        }
                    );


                // =========================================
                // NOT LOGGED IN
                // =========================================

                if (response.status === 401) {

                    navigate("/login");

                    return;
                }


                // =========================================
                // OTHER ERROR
                // =========================================

                if (!response.ok) {

                    const message =
                        await response.text();

                    throw new Error(
                        message ||
                        "Unable to load login history"
                    );
                }


                const data =
                    await response.json();


                if (!mounted) {

                    return;

                }


                setHistory(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (error) {

                console.error(
                    "Login history error:",
                    error
                );


                if (mounted) {

                    setError(
                        error.message ||
                        "Unable to load login history"
                    );

                }


            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        }


        loadLoginHistory();


        return () => {

            mounted = false;

        };

    }, [navigate]);


    // =====================================================
    // LOAD CURRENT USER NAME
    // =====================================================

    useEffect(() => {

        let mounted = true;


        async function loadUser() {

            try {

                const response =
                    await fetch(
                        "http://localhost:8082/api/dashboard",
                        {
                            method: "GET",
                            credentials: "include"
                        }
                    );


                if (response.status === 401) {

                    navigate("/login");

                    return;
                }


                if (!response.ok) {

                    return;

                }


                const data =
                    await response.json();


                if (
                    mounted &&
                    data.authenticated
                ) {

                    setFullName(
                        data.fullName || ""
                    );

                }

            } catch (error) {

                console.error(
                    "User loading error:",
                    error
                );

            }

        }


        loadUser();


        return () => {

            mounted = false;

        };

    }, [navigate]);


    // =====================================================
    // LOGOUT
    // =====================================================

    async function handleLogout(e) {

        e.preventDefault();


        try {

            await fetch(
                "http://localhost:8082/api/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        } finally {

            navigate("/login");

        }

    }


    // =====================================================
    // FORMAT DATE & TIME
    // =====================================================

    function formatDateTime(value) {

        if (!value) {

            return "-";

        }


        const date =
            new Date(value);


        if (Number.isNaN(
            date.getTime()
        )) {

            return value;

        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    }


    // =====================================================
    // STATUS CLASS
    // =====================================================

    function getStatusClass(status) {

        if (
            String(status)
                .toUpperCase()
                === "SUCCESS"
        ) {

            return "success";

        }


        return "failed";

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="login-history-page">

                <header className="navbar">

                    <div className="logo">

                        <i className="fa-solid fa-lock"></i>

                        <span>
                            PasswordVault
                        </span>

                    </div>

                </header>


                <main className="content">

                    <section className="table-card">

                        <div className="table-header">

                            <h3>
                                Loading Login History...
                            </h3>

                        </div>

                    </section>

                </main>

            </div>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="login-history-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="navbar">

                <div className="logo">

                    <i className="fa-solid fa-lock"></i>

                    <span>
                        PasswordVault
                    </span>

                </div>


                {/* =================================================
                    PROFILE
                ================================================= */}

                <div className="profile">

                    <button
                        type="button"
                        className="profile-btn"
                        onClick={(e) => {

                            e.stopPropagation();

                            setProfileOpen(
                                (value) => !value
                            );

                        }}
                    >

                        <i className="fa-solid fa-circle-user"></i>

                        <span>
                            {fullName || "User"}
                        </span>

                        <i className="fa-solid fa-angle-down"></i>

                    </button>


                    {profileOpen && (

                        <div
                            className="dropdown show"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <Link to="/profile">

                                <i className="fa-solid fa-user"></i>

                                My Profile

                            </Link>


                            <Link to="/change-password">

                                <i className="fa-solid fa-key"></i>

                                Change Password

                            </Link>


                            <Link to="/settings">

                                <i className="fa-solid fa-gear"></i>

                                Settings

                            </Link>


                            <hr />


                            <a
                                href="/login"
                                onClick={handleLogout}
                            >

                                <i className="fa-solid fa-right-from-bracket"></i>

                                Logout

                            </a>

                        </div>

                    )}

                </div>

            </header>


            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="wrapper">


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="sidebar">

                    <Link to="/dashboard">

                        <i className="fa-solid fa-chart-line"></i>

                        Overview

                    </Link>


                    <Link to="/passwords">

                        <i className="fa-solid fa-key"></i>

                        My Passwords

                    </Link>


                    <Link to="/add-password">

                        <i className="fa-solid fa-plus"></i>

                        Add Password

                    </Link>


                    <Link to="/inbox">

                        <i className="fa-solid fa-inbox"></i>

                        Inbox

                    </Link>


                    <Link to="/sent">

                        <i className="fa-solid fa-paper-plane"></i>

                        Sent

                    </Link>


                    <Link
                        to="/login-history"
                        className="active"
                    >

                        <i className="fa-solid fa-clock-rotate-left"></i>

                        Login History

                    </Link>
                    <Link to="/security">

        <i className="fa-solid fa-shield-halved"></i>

        Security

    </Link>

                </aside>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="content">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <section className="welcome">

                        <h2>
                            Login History
                        </h2>


                        <p>
                            View your recent successful and unsuccessful login attempts.
                        </p>

                    </section>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <p className="error">
                            {error}
                        </p>

                    )}


                    {/* =================================================
                        LOGIN HISTORY TABLE
                    ================================================= */}

                    <section className="table-card">


                        <div className="table-header">

                            <h3>
                                Recent Login Activity
                            </h3>

                        </div>


                        {history.length === 0 ? (

                            <div className="empty">

                                <i className="fa-solid fa-clock-rotate-left"></i>

                                <h3>
                                    No Login History
                                </h3>

                                <p>
                                    Your login activity will appear here.
                                </p>

                            </div>

                        ) : (

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Date & Time
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {history.map(
                                        (item) => (

                                            <tr
                                                key={item.id}
                                            >

                                                <td>

                                                    <i className="fa-solid fa-envelope"></i>

                                                    <span>
                                                        {" "}
                                                        {item.email}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`login-status ${getStatusClass(
                                                            item.status
                                                        )}`}
                                                    >

                                                        <i
                                                            className={
                                                                String(item.status)
                                                                    .toUpperCase()
                                                                    === "SUCCESS"
                                                                    ? "fa-solid fa-circle-check"
                                                                    : "fa-solid fa-circle-xmark"
                                                            }
                                                        ></i>

                                                        {" "}

                                                        {item.status}

                                                    </span>

                                                </td>


                                                <td>

                                                    <i className="fa-regular fa-clock"></i>

                                                    {" "}

                                                    {formatDateTime(
                                                        item.loginTime
                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        )}

                    </section>

                </main>

            </div>

        </div>
    );
}

export default LoginHistory;