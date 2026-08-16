import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/dashboard/dashboard.css";


function Sent() {

    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [fullName, setFullName] =
        useState("");

    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


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
    // LOAD SENT PASSWORDS
    // =====================================================

    useEffect(() => {

        loadSent();

    }, []);


    async function loadSent() {

        try {

            setLoading(true);
            setError("");


            const response =
                await fetch(
                    "http://localhost:8082/api/shares/sent",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            // =================================================
            // NOT LOGGED IN
            // =================================================

            if (response.status === 401) {

                navigate("/login");

                return;
            }


            // =================================================
            // SERVER ERROR
            // =================================================

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Unable to load sent passwords"
                );
            }


            // =================================================
            // RESPONSE
            // =================================================

            const data =
                await response.json();


            // =================================================
            // GET USER NAME
            //
            // Your sharing API does not necessarily return
            // fullName separately, so keep the existing
            // session/dashboard-style profile if available.
            // =================================================

            if (
                data &&
                !Array.isArray(data) &&
                data.fullName
            ) {

                setFullName(
                    data.fullName
                );

            }


            setItems(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (err) {

            console.error(
                "Sent error:",
                err
            );

            setError(
                err.message ||
                "Unable to load sent passwords"
            );

        } finally {

            setLoading(false);

        }
    }


    // =====================================================
    // LOAD USER PROFILE NAME
    // =====================================================

    useEffect(() => {

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


                if (
                    response.status === 401
                ) {

                    navigate("/login");

                    return;
                }


                if (!response.ok) {

                    return;
                }


                const data =
                    await response.json();


                if (
                    !data.authenticated
                ) {

                    navigate("/login");

                    return;
                }


                setFullName(
                    data.fullName || "User"
                );


            } catch (err) {

                console.error(
                    "Profile loading error:",
                    err
                );

            }

        }


        loadUser();

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

        } catch (err) {

            console.error(
                "Logout error:",
                err
            );

        } finally {

            navigate("/login");

        }
    }


    // =====================================================
    // REMOVE ACCESS
    // =====================================================

    async function removeAccess(
        shareId
    ) {

        const confirmDelete =
            window.confirm(
                "Remove this user's access?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const response =
                await fetch(
                    `http://localhost:8082/api/shares/${shareId}`,
                    {
                        method: "DELETE",
                        credentials: "include"
                    }
                );


            const message =
                await response.text();


            if (!response.ok) {

                alert(
                    message ||
                    "Unable to remove access"
                );

                return;

            }


            // Refresh Sent list

            await loadSent();


        } catch (err) {

            console.error(
                "Remove access error:",
                err
            );

            alert(
                "Unable to remove access"
            );

        }
    }


    // =====================================================
    // FORMAT PERMISSION
    // =====================================================

    function formatPermission(
        permission
    ) {

        if (!permission) {

            return "-";

        }


        switch (permission) {

            case "VIEW_ONLY":

                return "View Only";


            case "EDIT":

                return "Edit Access";


            case "FULL_MANAGEMENT":

                return "Full Management";


            default:

                return permission;

        }
    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-page">


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

                </header>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="content">

                    <section className="table-card">

                        <div className="table-header">

                            <h3>
                                Loading Sent Passwords...
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

        <div className="dashboard-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="navbar">


                {/* LOGO */}

                <div className="logo">

                    <i className="fa-solid fa-lock"></i>

                    <span>
                        PasswordVault
                    </span>

                </div>


                {/* PROFILE */}

                <div className="profile">

                    <button
                        type="button"
                        className="profile-btn"
                        onClick={(e) => {

                            e.stopPropagation();

                            setProfileOpen(
                                (value) =>
                                    !value
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
                                onClick={
                                    handleLogout
                                }
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


                    {/* DASHBOARD */}

                    <Link to="/dashboard">

                        <i className="fa-solid fa-chart-line"></i>

                        Overview

                    </Link>


                    {/* MY PASSWORDS */}

                    <Link to="/passwords">

                        <i className="fa-solid fa-key"></i>

                        My Passwords

                    </Link>


                    {/* ADD PASSWORD */}

                    <Link to="/add-password">

                        <i className="fa-solid fa-plus"></i>

                        Add Password

                    </Link>


                    {/* INBOX */}

                    <Link to="/inbox">

                        <i className="fa-solid fa-inbox"></i>

                        Inbox

                    </Link>


                    {/* SENT */}

                    <Link
                        to="/sent"
                        className="active"
                    >

                        <i className="fa-solid fa-paper-plane"></i>

                        Sent

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
                            Sent
                        </h2>

                        <p>
                            Passwords shared by you
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
                        EMPTY
                    ================================================= */}

                    {!error &&
                        items.length === 0 && (

                            <section className="table-card">

                                <div className="table-header">

                                    <h3>
                                        Nothing shared yet
                                    </h3>

                                </div>


                                <div
                                    style={{
                                        textAlign:
                                            "center",
                                        padding:
                                            "40px"
                                    }}
                                >

                                    <i
                                        className="fa-solid fa-paper-plane"
                                        style={{
                                            fontSize:
                                                "35px",
                                            marginBottom:
                                                "15px"
                                        }}
                                    ></i>


                                    <p>

                                        Passwords you share
                                        will appear here.

                                    </p>

                                </div>

                            </section>

                        )
                    }


                    {/* =================================================
                        SENT TABLE
                    ================================================= */}

                    {!error &&
                        items.length > 0 && (

                            <section className="table-card">


                                {/* TABLE HEADER */}

                                <div className="table-header">

                                    <h3>
                                        Passwords Shared By You
                                    </h3>

                                </div>


                                {/* TABLE */}

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Website
                                            </th>

                                            <th>
                                                Shared With
                                            </th>

                                            <th>
                                                Permission
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {items.map(
                                            (item) => (

                                                <tr
                                                    key={
                                                        item.shareId
                                                    }
                                                >


                                                    {/* WEBSITE */}

                                                    <td>

                                                        <i className="fa-solid fa-globe"></i>

                                                        <span>

                                                            {" "}

                                                            {
                                                                item.websiteName
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* SHARED WITH */}

                                                    <td>

                                                        <strong>

                                                            {
                                                                item.recipientName
                                                            }

                                                        </strong>


                                                        <small>

                                                            {
                                                                item.recipientEmail
                                                            }

                                                        </small>

                                                    </td>


                                                    {/* PERMISSION */}

                                                    <td>

                                                        <span
                                                            className="permission"
                                                        >

                                                            {
                                                                formatPermission(
                                                                    item.permission
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td>


                                                        {/* MANAGE */}

                                                        <Link
                                                            to={
                                                                `/share-password/${item.passwordId}`
                                                            }
                                                            title="Manage Sharing"
                                                        >

                                                            <i
                                                                className="fa-solid fa-gear action"
                                                            ></i>

                                                        </Link>


                                                        {" "}


                                                        {/* REMOVE */}

                                                        <button
                                                            type="button"
                                                            className="delete-password-btn"
                                                            onClick={() =>
                                                                removeAccess(
                                                                    item.shareId
                                                                )
                                                            }
                                                            title="Remove Access"
                                                        >

                                                            <i
                                                                className="fa-solid fa-user-minus action delete"
                                                            ></i>

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </section>

                        )
                    }

                </main>

            </div>

        </div>
    );
}


export default Sent;