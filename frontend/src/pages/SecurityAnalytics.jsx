import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/security-analytics/security-analytics.css";


function SecurityAnalytics() {

    const navigate = useNavigate();

    const [fullName, setFullName] =
        useState("");

    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // FETCH SECURITY ANALYTICS
    // =====================================================

    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");


            const response = await fetch(
                "http://localhost:8082/api/security/analytics",
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

                const message =
                    await response.text();

                throw new Error(
                    message || "Unable to load security analytics"
                );
            }


            const data =
                await response.json();


            setAnalytics(data);


        } catch (error) {

            console.error(
                "Security analytics error:",
                error
            );


            if (
                error instanceof TypeError
            ) {

                setError(
                    "Unable to connect to server. Please check your connection and try again."
                );

            } else {

                setError(
                    "Unable to load security analytics. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


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


                if (!data.authenticated) {

                    navigate("/login");

                    return;
                }


                setFullName(
                    data.fullName
                );


            } catch (error) {

                console.error(
                    "Profile loading error:",
                    error
                );

            }

        }


        loadUser();

    }, [navigate]);


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadAnalytics();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout
                fullName={fullName}
                pageClassName="security-analytics-page"
            >

                <div className="security-loading">

                    <div className="security-spinner"></div>

                    <p>
                        Loading security analytics...
                    </p>

                </div>

            </Layout>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Layout
                fullName={fullName}
                pageClassName="security-analytics-page"
            >

                <div className="security-error">

                    <h2>
                        Security Analytics
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={loadAnalytics}
                    >
                        Try Again
                    </button>

                </div>

            </Layout>

        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <Layout
            fullName={fullName}
            pageClassName="security-analytics-page"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="security-analytics-header">

                <div>

                    <h1>
                        Security Analytics
                    </h1>

                    <p>
                        Monitor your account security
                        and recent security activity.
                    </p>

                </div>


                <button
                    className="security-refresh-btn"
                    onClick={loadAnalytics}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="security-stat-grid">


                {/* TOTAL LOGINS */}

                <div className="security-stat-card">

                    <div className="security-stat-icon login-icon">
                        ↗
                    </div>

                    <div>

                        <p>
                            Total Logins
                        </p>

                        <h2>
                            {analytics.totalLogins}
                        </h2>

                    </div>

                </div>


                {/* SUCCESSFUL */}

                <div className="security-stat-card">

                    <div className="security-stat-icon success-icon">
                        ✓
                    </div>

                    <div>

                        <p>
                            Successful Logins
                        </p>

                        <h2>
                            {analytics.successfulLogins}
                        </h2>

                    </div>

                </div>


                {/* FAILED */}

                <div className="security-stat-card">

                    <div className="security-stat-icon failed-icon">
                        !
                    </div>

                    <div>

                        <p>
                            Failed Logins
                        </p>

                        <h2>
                            {analytics.failedLogins}
                        </h2>

                    </div>

                </div>


                {/* SUSPICIOUS */}

                <div className="security-stat-card">

                    <div className="security-stat-icon suspicious-icon">
                        ⚠
                    </div>

                    <div>

                        <p>
                            Suspicious Activities
                        </p>

                        <h2>
                            {analytics.suspiciousActivities}
                        </h2>

                    </div>

                </div>


                {/* ALERTS */}

                <div className="security-stat-card">

                    <div className="security-stat-icon alert-icon">
                        🔔
                    </div>

                    <div>

                        <p>
                            Security Alerts
                        </p>

                        <h2>
                            {analytics.securityAlerts}
                        </h2>

                    </div>

                </div>

            </div>


            {/* =================================================
                LOGIN ACTIVITY
            ================================================= */}

            <section className="security-section">

                <div className="security-section-title">

                    <div>

                        <h2>
                            Login Activity
                        </h2>

                        <p>
                            Recent login attempts
                        </p>

                    </div>

                </div>


                <div className="security-table-container">

                    <table className="security-table">

                        <thead>

                            <tr>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Date & Time
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {analytics.loginActivity
                                .slice(0, 10)
                                .map(
                                    (activity, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>

                                                <span
                                                    className={
                                                        activity.status ===
                                                        "SUCCESS"
                                                            ? "status-success"
                                                            : "status-failed"
                                                    }
                                                >

                                                    {activity.status}

                                                </span>

                                            </td>


                                            <td>

                                                {formatDate(
                                                    activity.loginTime
                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =================================================
                TWO COLUMN SECTION
            ================================================= */}

            <div className="security-two-column">


                {/* =================================================
                    SUSPICIOUS ACTIVITIES
                ================================================= */}

                <section className="security-section">

                    <div className="security-section-title">

                        <div>

                            <h2>
                                Suspicious Activities
                            </h2>

                            <p>
                                Detected unusual activity
                            </p>

                        </div>

                    </div>


                    <div className="security-activity-list">

                        {analytics.suspiciousActivity.length === 0 ? (

                            <div className="security-empty">
                                No suspicious activities detected.
                            </div>

                        ) : (

                            analytics.suspiciousActivity
                                .slice(0, 5)
                                .map(
                                    (activity, index) => (

                                        <div
                                            className="security-activity-item suspicious-item"
                                            key={index}
                                        >

                                            <div className="activity-warning-icon">
                                                ⚠
                                            </div>


                                            <div className="activity-content">

                                                <h3>
                                                    {activity.activityType}
                                                </h3>

                                                <p>
                                                    {activity.description}
                                                </p>

                                                <span>
                                                    {formatDate(
                                                        activity.detectedAt
                                                    )}
                                                </span>

                                            </div>


                                            <span className="flagged-badge">
                                                {activity.status}
                                            </span>

                                        </div>

                                    )
                                )

                        )}

                    </div>

                </section>


                {/* =================================================
                    SECURITY ALERTS
                ================================================= */}

                <section className="security-section">

                    <div className="security-section-title">

                        <div>

                            <h2>
                                Security Alerts
                            </h2>

                            <p>
                                Important security notifications
                            </p>

                        </div>

                    </div>


                    <div className="security-activity-list">

                        {analytics.securityAlertsList.length === 0 ? (

                            <div className="security-empty">
                                No security alerts.
                            </div>

                        ) : (

                            analytics.securityAlertsList
                                .slice(0, 5)
                                .map(
                                    (alert, index) => (

                                        <div
                                            className="security-activity-item alert-item"
                                            key={index}
                                        >

                                            <div className="activity-alert-icon">
                                                !
                                            </div>


                                            <div className="activity-content">

                                                <h3>
                                                    {alert.alertType}
                                                </h3>

                                                <p>
                                                    {alert.message}
                                                </p>

                                                <span>
                                                    {formatDate(
                                                        alert.createdAt
                                                    )}
                                                </span>

                                            </div>


                                            <div className="alert-meta">

                                                <span className="severity-high">
                                                    {alert.severity}
                                                </span>

                                                <span className="alert-status">
                                                    {alert.status}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )

                        )}

                    </div>

                </section>

            </div>


            {/* =================================================
                AUDIT LOGS
            ================================================= */}

            <section className="security-section">

                <div className="security-section-title">

                    <div>

                        <h2>
                            Recent Audit Activity
                        </h2>

                        <p>
                            Important security events recorded
                            in your account
                        </p>

                    </div>

                </div>


                <div className="security-audit-list">

                    {analytics.recentActivity.length === 0 ? (

                        <div className="security-empty">
                            No recent activity.
                        </div>

                    ) : (

                        analytics.recentActivity
                            .slice(0, 10)
                            .map(
                                (activity, index) => (

                                    <div
                                        className="security-audit-item"
                                        key={index}
                                    >

                                        <div className="audit-dot"></div>


                                        <div className="audit-content">

                                            <h3>
                                                {activity.action}
                                            </h3>

                                            <p>
                                                {activity.description}
                                            </p>

                                        </div>


                                        <span className="audit-time">

                                            {formatDate(
                                                activity.timestamp
                                            )}

                                        </span>

                                    </div>

                                )
                            )

                    )}

                </div>

            </section>

        </Layout>

    );
}


// =====================================================
// DATE FORMATTER
// =====================================================

function formatDate(dateString) {

    if (!dateString) {

        return "-";
    }


    const date =
        new Date(dateString);


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


export default SecurityAnalytics;