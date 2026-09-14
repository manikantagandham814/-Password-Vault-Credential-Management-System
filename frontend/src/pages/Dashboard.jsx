import API_URL from "../config";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/dashboard/dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [totalPasswords, setTotalPasswords] = useState(0);
    const [recentPasswords, setRecentPasswords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dashboardError, setDashboardError] = useState("");

    const [passwordHealth, setPasswordHealth] = useState({
        totalCredentials: 0,
        strongPasswords: 0,
        mediumPasswords: 0,
        weakPasswords: 0,
        healthScore: 0
    });

    const [healthLoading, setHealthLoading] = useState(true);
    const [healthError, setHealthError] = useState("");


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        let mounted = true;

        async function loadDashboard() {

            try {

                setDashboardError("");

                const response = await fetch(
                    `${API_URL}/api/dashboard`,
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

                    if (mounted) {

                        setDashboardError(
                            "Unable to load dashboard. Please try again."
                        );
                    }

                    return;
                }


                const data = await response.json();


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

                    setDashboardError(
                        "Unable to connect to server. Please try again."
                    );
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
    // LOAD PASSWORD HEALTH
    // =====================================================

    useEffect(() => {

        let mounted = true;

        async function loadPasswordHealth() {

            try {

                setHealthError("");

                const response = await fetch(
                    `${API_URL}/api/reports/password-health`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


                // Password health is a secondary dashboard request.
                // Do not redirect to login if this report alone returns 401.
                if (response.status === 401) {

                    if (mounted) {
                        setHealthError(
                            "Unable to load password health information."
                        );
                    }

                    return;
                }


                // Other server/API error
                if (!response.ok) {

                    if (mounted) {

                        setHealthError(
                            "Unable to load password health information."
                        );
                    }

                    return;
                }


                const data =
                    await response.json();


                if (!mounted) {
                    return;
                }


                setPasswordHealth({

                    totalCredentials:
                        data.totalCredentials || 0,

                    strongPasswords:
                        data.strongPasswords || 0,

                    mediumPasswords:
                        data.mediumPasswords || 0,

                    weakPasswords:
                        data.weakPasswords || 0,

                    healthScore:
                        data.healthScore || 0
                });


            } catch (error) {

                console.error(
                    "Password health error:",
                    error
                );


                if (mounted) {

                    setHealthError(
                        "Unable to load password health information. Please try again."
                    );
                }


            } finally {

                if (mounted) {

                    setHealthLoading(false);
                }
            }
        }


        loadPasswordHealth();


        return () => {

            mounted = false;
        };

    }, [navigate]);


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
                `${API_URL}/api/passwords/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );


            // Unauthorized session
            if (response.status === 401) {

                navigate("/login");

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Unable to delete password"
                );
            }


            setRecentPasswords((previous) =>
                previous.filter(
                    (password) =>
                        password.id !== id
                )
            );


            setTotalPasswords((previous) =>
                Math.max(0, previous - 1)
            );


        } catch (error) {

            console.error(
                "Delete password error:",
                error
            );


            alert(
                "Unable to delete password. Please try again."
            );
        }
    }


    // =====================================================
    // SHARE PASSWORD
    // =====================================================

    function handleShare(id) {

        navigate(
            `/share-password/${id}`
        );
    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout fullName={fullName}>

                <section className="table-card">

                    <div className="table-header">

                        <h3>
                            Loading Dashboard...
                        </h3>

                    </div>

                </section>

            </Layout>
        );
    }


    // =====================================================
    // DASHBOARD UI
    // =====================================================

    return (

        <Layout fullName={fullName}>

            {/* =================================================
                DASHBOARD ERROR
            ================================================= */}

            {dashboardError && (

                <div className="error">

                    {dashboardError}

                </div>

            )}


            {/* =================================================
                WELCOME
            ================================================= */}

            <section className="welcome">

                <h2>

                    Welcome Back,

                    <span>
                        {" "}
                        {fullName}
                    </span>

                    {" "}👋

                </h2>


                <p>
                    Manage all your passwords securely in one place.
                </p>

            </section>


            {/* =================================================
                PASSWORD HEALTH
            ================================================= */}

            <section className="password-health-card">

                <div className="password-health-header">

                    <div>

                        <h3>

                            <i className="fa-solid fa-shield-halved"></i>

                            Password Health

                        </h3>


                        <p>
                            Overview of the strength of your saved passwords.
                        </p>

                    </div>


                    <div className="health-score">

                        <span>
                            Overall Health
                        </span>


                        <strong>

                            {healthLoading
                                ? "--"
                                : `${passwordHealth.healthScore}%`}

                        </strong>

                    </div>

                </div>


                {healthLoading ? (

                    <div className="health-loading">

                        Analyzing your passwords...

                    </div>

                ) : healthError ? (

                    <div className="error">

                        {healthError}

                    </div>

                ) : (

                    <>

                        <div className="health-stat-grid">

                            {/* TOTAL CREDENTIALS */}

                            <div className="health-stat">

                                <div className="health-icon total">

                                    <i className="fa-solid fa-key"></i>

                                </div>


                                <div>

                                    <strong>
                                        {passwordHealth.totalCredentials}
                                    </strong>

                                    <span>
                                        Total Credentials
                                    </span>

                                </div>

                            </div>


                            {/* STRONG */}

                            <div className="health-stat">

                                <div className="health-icon strong">

                                    <i className="fa-solid fa-circle-check"></i>

                                </div>


                                <div>

                                    <strong>
                                        {passwordHealth.strongPasswords}
                                    </strong>

                                    <span>
                                        Strong
                                    </span>

                                </div>

                            </div>


                            {/* MEDIUM */}

                            <div className="health-stat">

                                <div className="health-icon medium">

                                    <i className="fa-solid fa-circle-exclamation"></i>

                                </div>


                                <div>

                                    <strong>
                                        {passwordHealth.mediumPasswords}
                                    </strong>

                                    <span>
                                        Medium
                                    </span>

                                </div>

                            </div>


                            {/* WEAK */}

                            <div className="health-stat">

                                <div className="health-icon weak">

                                    <i className="fa-solid fa-triangle-exclamation"></i>

                                </div>


                                <div>

                                    <strong>
                                        {passwordHealth.weakPasswords}
                                    </strong>

                                    <span>
                                        Weak
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* PASSWORD HEALTH PROGRESS */}

                        <div className="health-progress">

                            <div className="health-progress-label">

                                <span>
                                    Password Strength
                                </span>


                                <strong>
                                    {passwordHealth.healthScore}%
                                </strong>

                            </div>


                            <div className="health-progress-track">

                                <div
                                    className="health-progress-fill"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                passwordHealth.healthScore
                                            )
                                        )}%`
                                    }}
                                ></div>

                            </div>

                        </div>

                    </>

                )}

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

                                            {/* VIEW */}

                                            <Link
                                                to={`/view-password/${password.id}`}
                                                title="View Password"
                                            >

                                                <i className="fa-solid fa-eye action view"></i>

                                            </Link>


                                            {/* EDIT */}

                                            <Link
                                                to={`/edit-password/${password.id}`}
                                                title="Edit Password"
                                            >

                                                <i className="fa-solid fa-pen action edit"></i>

                                            </Link>


                                            {/* SHARE */}

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


                                            {/* DELETE */}

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

        </Layout>
    );
}


export default Dashboard;