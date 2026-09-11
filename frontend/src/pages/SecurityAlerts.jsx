import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/dashboard/dashboard.css";
import "../styles/security/security.css";


function SecurityAlerts() {

    const navigate = useNavigate();


    // =====================================================
    // PROFILE
    // =====================================================

    const [fullName, setFullName] =
        useState("");


    // =====================================================
    // SECURITY ALERTS
    // =====================================================

    const [alerts, setAlerts] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadAlerts();

    }, []);


    async function loadAlerts() {

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
            // LOAD SECURITY ALERTS
            // =================================================

            const alertsResponse =
                await fetch(
                    "http://localhost:8082/api/security/alerts",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (
                alertsResponse.status === 401
            ) {

                navigate("/login");

                return;

            }


            if (!alertsResponse.ok) {

                throw new Error(
                    "Unable to load security alerts"
                );

            }


            const alertsData =
                await alertsResponse.json();


            setAlerts(
                Array.isArray(alertsData)
                    ? alertsData
                    : []
            );


        } catch (error) {

            console.error(
                "Security alerts error:",
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
                    "Unable to load security alerts. Please try again."
                );

            }

        } finally {

            setLoading(false);

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
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout
                fullName={fullName}
                pageClassName="security-page"
            >

                <section className="table-card">

                    <div className="table-header">

                        <h3>
                            Loading Security Alerts...
                        </h3>

                    </div>

                </section>

            </Layout>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <Layout
            fullName={fullName}
            pageClassName="security-page"
        >

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="security-header">

                <div>

                    <h2>
                        Security Alerts
                    </h2>

                    <p>
                        Important security notifications for your account.
                    </p>

                </div>


                <button
                    type="button"
                    className="security-refresh"
                    onClick={loadAlerts}
                >

                    <i className="fa-solid fa-rotate"></i>

                    Refresh

                </button>

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


        </Layout>

    );

}


export default SecurityAlerts;