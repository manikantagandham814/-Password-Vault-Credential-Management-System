import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/dashboard/dashboard.css";
import "../styles/security/security.css";


function Security() {

    const navigate = useNavigate();


    // =====================================================
    // PROFILE
    // =====================================================

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [fullName, setFullName] =
        useState("");


    // =====================================================
    // SECURITY DATA
    // =====================================================

    const [alerts, setAlerts] =
        useState([]);

    const [suspicious, setSuspicious] =
        useState([]);

    const [auditLogs, setAuditLogs] =
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
    // LOAD SECURITY DATA
    // =====================================================

    useEffect(() => {

        loadSecurityData();

    }, []);


    async function loadSecurityData() {

        try {

            setLoading(true);

            setError("");


            // =================================================
            // LOAD DASHBOARD DATA
            // =================================================

            const dashboardResponse =
                await fetch(
                    "http://localhost:8082/api/dashboard",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (
                dashboardResponse.status === 401
            ) {

                navigate("/login");

                return;

            }


            if (!dashboardResponse.ok) {

                throw new Error(
                    "Unable to load user information"
                );

            }


            const dashboardData =
                await dashboardResponse.json();


            if (
                !dashboardData.authenticated
            ) {

                navigate("/login");

                return;

            }


            setFullName(
                dashboardData.fullName || ""
            );


            // =================================================
            // LOAD SECURITY INFORMATION
            // =================================================

            const [
                alertsResponse,
                suspiciousResponse,
                auditResponse
            ] = await Promise.all([

                fetch(
                    "http://localhost:8082/api/security/alerts",
                    {
                        credentials: "include"
                    }
                ),

                fetch(
                    "http://localhost:8082/api/security/suspicious",
                    {
                        credentials: "include"
                    }
                ),

                fetch(
                    "http://localhost:8082/api/security/audit-logs",
                    {
                        credentials: "include"
                    }
                )

            ]);


            if (
                alertsResponse.status === 401 ||
                suspiciousResponse.status === 401 ||
                auditResponse.status === 401
            ) {

                navigate("/login");

                return;

            }


            if (
                !alertsResponse.ok ||
                !suspiciousResponse.ok ||
                !auditResponse.ok
            ) {

                throw new Error(
                    "Unable to load security information"
                );

            }


            const alertsData =
                await alertsResponse.json();

            const suspiciousData =
                await suspiciousResponse.json();

            const auditData =
                await auditResponse.json();


            setAlerts(
                Array.isArray(alertsData)
                    ? alertsData
                    : []
            );


            setSuspicious(
                Array.isArray(suspiciousData)
                    ? suspiciousData
                    : []
            );


            setAuditLogs(
                Array.isArray(auditData)
                    ? auditData
                    : []
            );


        } catch (error) {

            console.error(
                "Security error:",
                error
            );


            setError(
                "Unable to load security information"
            );


        } finally {

            setLoading(false);

        }

    }


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
    // FORMAT DATE
    // =====================================================

    function formatDate(value) {

        if (!value) {

            return "-";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    }


    // =====================================================
    // FORMAT TEXT
    // =====================================================

    function formatText(value) {

        if (!value) {

            return "-";

        }


        return value
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                character =>
                    character.toUpperCase()
            );

    }


    // =====================================================
    // SECURITY STATUS
    // =====================================================

    const securityIssue =
        alerts.length > 0 ||
        suspicious.length > 0;


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


                <main className="content">

                    <section className="table-card">

                        <div className="table-header">

                            <h3>
                                Loading Security...
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
                                value =>
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


                    <Link to="/login-history">

                        <i className="fa-solid fa-clock-rotate-left"></i>

                        Login History

                    </Link>


                    {/* SECURITY ACTIVE */}

                    <Link
                        to="/security"
                        className="active"
                    >

                        <i className="fa-solid fa-shield-halved"></i>

                        Security

                    </Link>


                </aside>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="content">


                    {/* =================================================
                        SECURITY HEADER
                    ================================================= */}

                    <section className="security-header">

                        <div>

                            <h2>
                                Security Center
                            </h2>

                            <p>
                                Monitor your account security,
                                suspicious activity and security events.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="security-refresh"
                            onClick={loadSecurityData}
                        >

                            <i className="fa-solid fa-rotate"></i>

                            Refresh

                        </button>

                    </section>


                    {/* =================================================
                        SECURITY STATUS
                    ================================================= */}

                    <section
                        className={
                            securityIssue
                                ? "security-status security-danger"
                                : "security-status security-safe"
                        }
                    >

                        <div className="security-status-icon">

                            <i
                                className={
                                    securityIssue
                                        ? "fa-solid fa-triangle-exclamation"
                                        : "fa-solid fa-shield-check"
                                }
                            ></i>

                        </div>


                        <div className="security-status-text">

                            <strong>

                                {securityIssue
                                    ? "Suspicious activity detected"
                                    : "Your account is secure"
                                }

                            </strong>


                            <span>

                                {securityIssue

                                    ? `${alerts.length} security alert${alerts.length === 1 ? "" : "s"} and ${suspicious.length} suspicious activit${suspicious.length === 1 ? "y" : "ies"} detected.`

                                    : "No suspicious activity has been detected on your account."
                                }

                            </span>

                        </div>


                        {securityIssue && (

                            <span className="security-action-required">

                                ACTION REQUIRED

                            </span>

                        )}

                    </section>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="security-error">

                            <i className="fa-solid fa-circle-exclamation"></i>

                            {error}

                        </div>

                    )}


                    {/* =================================================
                        SECURITY ALERTS
                    ================================================= */}

                    <section className="table-card security-card security-alert-card-section">


                        <div className="table-header security-section-header">

                            <div>

                                <h3>

                                    <i className="fa-solid fa-triangle-exclamation"></i>

                                    Security Alerts

                                </h3>

                                <p>
                                    Important security notifications
                                </p>

                            </div>


                            <span
                                className={
                                    alerts.length > 0
                                        ? "security-count danger-count"
                                        : "security-count"
                                }
                            >

                                {alerts.length}

                            </span>

                        </div>


                        {alerts.length === 0 ? (

                            <div className="security-empty">

                                <i className="fa-solid fa-shield-check"></i>

                                <h4>
                                    No Security Alerts
                                </h4>

                                <p>
                                    Your account has no active security alerts.
                                </p>

                            </div>

                        ) : (

                            <div className="security-alert-list">

                                {alerts.map(
                                    alert => (

                                        <div
                                            className="security-alert-item"
                                            key={alert.id}
                                        >

                                            <div className="security-alert-icon">

                                                <i className="fa-solid fa-triangle-exclamation"></i>

                                            </div>


                                            <div className="security-alert-content">

                                                <div className="security-alert-title">

                                                    <h4>
                                                        {formatText(
                                                            alert.alertType
                                                        )}
                                                    </h4>


                                                    <span className="high-badge">

                                                        {alert.severity || "HIGH"}

                                                    </span>

                                                </div>


                                                <p>
                                                    {alert.message}
                                                </p>


                                                <div className="security-alert-meta">

                                                    <span>

                                                        <i className="fa-regular fa-clock"></i>

                                                        {formatDate(
                                                            alert.createdAt
                                                        )}

                                                    </span>


                                                    <span className="unread-status">

                                                        {alert.status}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        SUSPICIOUS ACTIVITY
                    ================================================= */}

                    <section className="table-card security-card">


                        <div className="table-header security-section-header">

                            <div>

                                <h3>

                                    <i className="fa-solid fa-user-secret"></i>

                                    Suspicious Activity

                                </h3>

                                <p>
                                    Unusual activity detected on your account
                                </p>

                            </div>


                            <span
                                className={
                                    suspicious.length > 0
                                        ? "security-count danger-count"
                                        : "security-count"
                                }
                            >

                                {suspicious.length}

                            </span>

                        </div>


                        {suspicious.length === 0 ? (

                            <div className="security-empty">

                                <i className="fa-solid fa-circle-check"></i>

                                <h4>
                                    No Suspicious Activity
                                </h4>

                                <p>
                                    No unusual activity has been detected.
                                </p>

                            </div>

                        ) : (

                            <div className="security-table-wrapper">

                                <table className="security-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Activity
                                            </th>

                                            <th>
                                                Description
                                            </th>

                                            <th>
                                                Detected
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {suspicious.map(
                                            activity => (

                                                <tr
                                                    key={activity.id}
                                                >

                                                    <td>

                                                        <strong>
                                                            {formatText(
                                                                activity.activityType
                                                            )}
                                                        </strong>

                                                    </td>


                                                    <td>
                                                        {
                                                            activity.description
                                                        }
                                                    </td>


                                                    <td>
                                                        {formatDate(
                                                            activity.detectedAt
                                                        )}
                                                    </td>


                                                    <td>

                                                        <span className="flagged-badge">

                                                            <i className="fa-solid fa-flag"></i>

                                                            {activity.status}

                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        AUDIT LOGS
                    ================================================= */}

                    <section className="table-card security-card">


                        <div className="table-header security-section-header">

                            <div>

                                <h3>

                                    <i className="fa-solid fa-list-check"></i>

                                    Audit Logs

                                </h3>

                                <p>
                                    History of important security events
                                </p>

                            </div>


                            <span className="security-count">

                                {auditLogs.length}

                            </span>

                        </div>


                        {auditLogs.length === 0 ? (

                            <div className="security-empty">

                                <i className="fa-solid fa-file-circle-check"></i>

                                <h4>
                                    No Audit Logs
                                </h4>

                                <p>
                                    No security events have been recorded.
                                </p>

                            </div>

                        ) : (

                            <div className="security-table-wrapper">

                                <table className="security-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Action
                                            </th>

                                            <th>
                                                Description
                                            </th>

                                            <th>
                                                Time
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {auditLogs.map(
                                            log => (

                                                <tr
                                                    key={log.id}
                                                >

                                                    <td>

                                                        <strong>
                                                            {formatText(
                                                                log.action
                                                            )}
                                                        </strong>

                                                    </td>


                                                    <td>
                                                        {
                                                            log.description
                                                        }
                                                    </td>


                                                    <td>
                                                        {formatDate(
                                                            log.timestamp
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>


                </main>

            </div>

        </div>
    );
}


export default Security;