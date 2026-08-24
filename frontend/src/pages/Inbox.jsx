import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/dashboard/dashboard.css";


function Inbox() {

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
    // LOAD INBOX
    // =====================================================

    useEffect(() => {

        loadInbox();

    }, []);


    async function loadInbox() {

        try {

            setLoading(true);
            setError("");


            const response =
                await fetch(
                    "http://localhost:8082/api/shares/inbox",
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
                    "Unable to load inbox"
                );
            }


            // =================================================
            // RESPONSE
            // =================================================

            const data =
                await response.json();


            setItems(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (err) {

            console.error(
                "Inbox error:",
                err
            );

            setError(
                err.message ||
                "Unable to load shared passwords"
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
    // DELETE SHARED PASSWORD
    // FULL MANAGEMENT ONLY
    // =====================================================

    async function handleDelete(
        shareId
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this password?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await fetch(
                    `http://localhost:8082/api/shares/${shareId}/password`,
                    {
                        method: "DELETE",
                        credentials: "include"
                    }
                );


            // =================================================
            // SESSION EXPIRED
            // =================================================

            if (
                response.status === 401
            ) {

                navigate("/login");

                return;
            }


            const message =
                await response.text();


            if (!response.ok) {

                alert(
                    message ||
                    "Unable to delete password"
                );

                return;
            }


            alert(
                "Password deleted successfully"
            );


            // Refresh inbox

            await loadInbox();


        } catch (err) {

            console.error(
                "Delete shared password error:",
                err
            );


            alert(
                "Unable to delete password"
            );

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
                                Loading Inbox...
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

                    <Link
                        to="/inbox"
                        className="active"
                    >

                        <i className="fa-solid fa-inbox"></i>

                        Inbox

                    </Link>


                    {/* SENT */}

                    <Link to="/sent">

                        <i className="fa-solid fa-paper-plane"></i>

                        Sent

                    </Link>
                     <Link to="/login-history">

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
                            Inbox
                        </h2>

                        <p>
                            Passwords shared with you
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
                                        No Shared Passwords
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
                                        className="fa-solid fa-inbox"
                                        style={{
                                            fontSize:
                                                "35px",
                                            marginBottom:
                                                "15px"
                                        }}
                                    ></i>


                                    <p>

                                        Passwords shared
                                        with you will
                                        appear here.

                                    </p>

                                </div>

                            </section>

                        )
                    }


                    {/* =================================================
                        INBOX TABLE
                    ================================================= */}

                    {!error &&
                        items.length > 0 && (

                            <section className="table-card">


                                {/* TABLE HEADER */}

                                <div className="table-header">

                                    <h3>
                                        Passwords Shared With You
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
                                                Shared By
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
                                            (item) => {

                                                const shareId =
                                                    item.shareId ||
                                                    item.id;

                                                const passwordId =
                                                    item.passwordId;

                                                const permission =
                                                    (
                                                        item.permission ||
                                                        ""
                                                    )
                                                    .toUpperCase()
                                                    .trim();


                                                const canEdit =
                                                    permission === "EDIT" ||
                                                    permission === "FULL_MANAGEMENT";


                                                const canManage =
                                                    permission === "FULL_MANAGEMENT";


                                                return (

                                                    <tr
                                                        key={
                                                            shareId
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


                                                        {/* SHARED BY */}

                                                        <td>

                                                            <strong>

                                                                {
                                                                    item.sharedByName ||
                                                                    item.ownerName ||
                                                                    "-"
                                                                }

                                                            </strong>


                                                            <small>

                                                                {
                                                                    item.sharedByEmail ||
                                                                    item.ownerEmail ||
                                                                    ""
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
                                                                        permission
                                                                    )
                                                                }

                                                            </span>

                                                        </td>


                                                        {/* =================================================
                                                            ACTIONS
                                                        ================================================= */}

                                                        <td>

                                                            <div
                                                                className="actions"
                                                            >


                                                                {/* VIEW */}

                                                                <Link
                                                                    to={
                                                                        `/shared-password/${shareId}`
                                                                    }
                                                                    className="view"
                                                                    title="View Password"
                                                                >

                                                                    <i className="fa-solid fa-eye"></i>

                                                                </Link>


                                                                {/* EDIT */}

                                                                {canEdit && (

                                                                    <Link
                                                                        to={
                                                                            `/edit-password/${passwordId}`
                                                                        }
                                                                        className="edit"
                                                                        title="Edit Password"
                                                                    >

                                                                        <i className="fa-solid fa-pen"></i>

                                                                    </Link>

                                                                )}


                                                                {/* DELETE */}

                                                                {canManage && (

                                                                    <button
                                                                        type="button"
                                                                        className="delete"
                                                                        title="Delete Password"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                shareId
                                                                            )
                                                                        }
                                                                    >

                                                                        <i className="fa-solid fa-trash"></i>

                                                                    </button>

                                                                )}


                                                                {/* MANAGE SHARING */}

                                                                {canManage && (

                                                                    <Link
                                                                        to={
                                                                            `/share-password/${passwordId}`
                                                                        }
                                                                        className="manage"
                                                                        title="Manage Sharing"
                                                                    >

                                                                        <i className="fa-solid fa-share-nodes"></i>

                                                                    </Link>

                                                                )}

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );

                                            }
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


export default Inbox;