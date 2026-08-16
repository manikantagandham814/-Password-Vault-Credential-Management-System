import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/dashboard/dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);

    const [fullName, setFullName] = useState("");
    const [totalPasswords, setTotalPasswords] = useState(0);
    const [totalWebsites, setTotalWebsites] = useState(0);
    const [recentPasswords, setRecentPasswords] = useState([]);

    const [loading, setLoading] = useState(true);


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
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        let mounted = true;

        async function loadDashboard() {

            try {

                const response = await fetch(
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

                    throw new Error(
                        "Unable to load dashboard"
                    );
                }


                const data =
                    await response.json();


                if (!data.authenticated) {

                    navigate("/login");

                    return;
                }


                if (!mounted) {
                    return;
                }


                setFullName(
                    data.fullName || ""
                );


                setTotalPasswords(
                    data.totalPasswords || 0
                );


                setTotalWebsites(
                    data.totalWebsites || 0
                );


                setRecentPasswords(
                    Array.isArray(data.recentPasswords)
                        ? data.recentPasswords
                        : []
                );


            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );

                if (mounted) {

                    navigate("/login");

                }

            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }
        }


        loadDashboard();


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
    // DELETE PASSWORD
    // =====================================================

    async function handleDelete(id) {

        const confirmDelete =
            window.confirm(
                "Delete this password?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8082/api/passwords/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );


            if (response.status === 401) {

                navigate("/login");

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Unable to delete password"
                );
            }


            setRecentPasswords(
                (previous) =>
                    previous.filter(
                        (password) =>
                            password.id !== id
                    )
            );


            setTotalPasswords(
                (previous) =>
                    Math.max(0, previous - 1)
            );


        } catch (error) {

            console.error(
                "Delete password error:",
                error
            );

            alert(
                "Unable to delete password"
            );

        }
    }


    // =====================================================
    // SHARE PASSWORD
    // =====================================================

    function handleShare(id) {

        navigate(`/share-password/${id}`);

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-page">

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
                                Loading Dashboard...
                            </h3>

                        </div>

                    </section>

                </main>

            </div>
        );
    }


    // =====================================================
    // DASHBOARD UI
    // =====================================================

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

                    <Link
                        to="/dashboard"
                        className="active"
                    >

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

                </aside>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="content">


                    {/* =================================================
                        WELCOME
                    ================================================= */}

                    <section className="welcome">

                        <h2>

                            Welcome Back,

                            <span>
                                {" "}{fullName || "User"}
                            </span>

                            {" "}👋

                        </h2>


                        <p>
                            Manage all your passwords securely
                            in one place.
                        </p>

                    </section>


                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <section className="cards">


                        {/* Saved Passwords */}

                        <div className="card">

                            <div className="card-icon">

                                <i className="fa-solid fa-key"></i>

                            </div>


                            <h1>
                                {totalPasswords}
                            </h1>


                            <p>
                                Saved Passwords
                            </p>

                        </div>


                        {/* Websites */}

                        <div className="card">

                            <div className="card-icon">

                                <i className="fa-solid fa-globe"></i>

                            </div>


                            <h1>
                                {totalWebsites}
                            </h1>


                            <p>
                                Websites
                            </p>

                        </div>


                        {/* Security */}

                        <div className="card">

                            <div className="card-icon">

                                <i className="fa-solid fa-shield-halved"></i>

                            </div>


                            <h1>
                                Strong
                            </h1>


                            <p>
                                Security
                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        RECENT PASSWORDS
                    ================================================= */}

                    <section className="table-card">


                        <div className="table-header">

                            <h3>
                                Recent Passwords
                            </h3>

                        </div>


                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Website
                                    </th>

                                    <th>
                                        Username
                                    </th>

                                    <th>
                                        Password
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {recentPasswords.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            style={{
                                                textAlign: "center"
                                            }}
                                        >

                                            No Passwords Added Yet

                                        </td>

                                    </tr>

                                ) : (

                                    recentPasswords.map(
                                        (password) => (

                                            <tr
                                                key={password.id}
                                            >

                                                <td>

                                                    <i className="fa-solid fa-globe"></i>

                                                    <span>
                                                        {" "}
                                                        {password.websiteName}
                                                    </span>

                                                </td>


                                                <td>
                                                    {password.username}
                                                </td>


                                                <td>
                                                    ••••••••
                                                </td>


                                                <td>

                                                    {/* View */}

                                                    <Link
                                                        to={`/view-password/${password.id}`}
                                                        title="View Password"
                                                    >

                                                        <i className="fa-solid fa-eye action view"></i>

                                                    </Link>


                                                    {/* Edit */}

                                                    <Link
                                                        to={`/edit-password/${password.id}`}
                                                        title="Edit Password"
                                                    >

                                                        <i className="fa-solid fa-pen action edit"></i>

                                                    </Link>


                                                    {/* Share */}

                                                    <button
                                                        type="button"
                                                        className="share-password-btn"
                                                        onClick={() =>
                                                            handleShare(
                                                                password.id
                                                            )
                                                        }
                                                        title="Share Password"
                                                    >

                                                        <i className="fa-solid fa-share-nodes action share"></i>

                                                    </button>


                                                    {/* Delete */}

                                                    <button
                                                        type="button"
                                                        className="delete-password-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                password.id
                                                            )
                                                        }
                                                        title="Delete Password"
                                                    >

                                                        <i className="fa-solid fa-trash action delete"></i>

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default Dashboard;