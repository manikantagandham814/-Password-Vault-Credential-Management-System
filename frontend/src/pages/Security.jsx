import API_URL from "../config";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/dashboard/dashboard.css";
import "../styles/security/security.css";


function Security() {

    const navigate = useNavigate();


    // =====================================================
    // PROFILE
    // =====================================================

    const [fullName, setFullName] =
        useState("");


    // =====================================================
    // SECURITY STATUS
    // =====================================================

    const [alertsCount, setAlertsCount] =
        useState(0);

    const [suspiciousCount, setSuspiciousCount] =
        useState(0);


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD SECURITY STATUS
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
                    `${API_URL}/api/dashboard`,
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
                suspiciousResponse
            ] = await Promise.all([

                fetch(
                    `${API_URL}/api/security/alerts`,
                    {
                        credentials: "include"
                    }
                ),

                fetch(
                    `${API_URL}/api/security/suspicious`,
                    {
                        credentials: "include"
                    }
                )

            ]);


            if (
                alertsResponse.status === 401 ||
                suspiciousResponse.status === 401
            ) {

                navigate("/login");

                return;

            }


            if (
                !alertsResponse.ok ||
                !suspiciousResponse.ok
            ) {

                throw new Error(
                    "Unable to load security information"
                );

            }


            const alertsData =
                await alertsResponse.json();

            const suspiciousData =
                await suspiciousResponse.json();


            setAlertsCount(
                Array.isArray(alertsData)
                    ? alertsData.length
                    : 0
            );


            setSuspiciousCount(
                Array.isArray(suspiciousData)
                    ? suspiciousData.length
                    : 0
            );


        } catch (error) {

            console.error(
                "Security error:",
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
                    "Unable to load security information. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    }


    // =====================================================
    // SECURITY STATUS
    // =====================================================

    const securityIssue =
        alertsCount > 0 ||
        suspiciousCount > 0;


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
                            Loading Security...
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

                            ? `${alertsCount} security alert${alertsCount === 1 ? "" : "s"} and ${suspiciousCount} suspicious activit${suspiciousCount === 1 ? "y" : "ies"} detected.`

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
                SECURITY OPTIONS
            ================================================= */}

            <section className="security-menu">


                {/* =================================================
                    SECURITY ALERTS
                ================================================= */}

                <Link
                    to="/security/alerts"
                    className="security-menu-link"
                >

                    <div className="table-card security-card">

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
                                    alertsCount > 0
                                        ? "security-count danger-count"
                                        : "security-count"
                                }
                            >

                                {alertsCount}

                            </span>

                        </div>

                    </div>

                </Link>


                {/* =================================================
                    SUSPICIOUS ACTIVITY
                ================================================= */}

                <Link
                    to="/security/suspicious"
                    className="security-menu-link"
                >

                    <div className="table-card security-card">

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
                                    suspiciousCount > 0
                                        ? "security-count danger-count"
                                        : "security-count"
                                }
                            >

                                {suspiciousCount}

                            </span>

                        </div>

                    </div>

                </Link>


                {/* =================================================
                    AUDIT LOGS
                ================================================= */}

                <Link
                    to="/security/audit-logs"
                    className="security-menu-link"
                >

                    <div className="table-card security-card">

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

                                View

                            </span>

                        </div>

                    </div>

                </Link>


                {/* =================================================
                    SECURITY ANALYTICS
                ================================================= */}

                <Link
                    to="/security/analytics"
                    className="security-menu-link"
                >

                    <div className="table-card security-card">

                        <div className="table-header security-section-header">

                            <div>

                                <h3>

                                    <i className="fa-solid fa-chart-pie"></i>

                                    Security Analytics

                                </h3>

                                <p>
                                    View security statistics and analysis
                                </p>

                            </div>


                            <span className="security-count">

                                View

                            </span>

                        </div>

                    </div>

                </Link>


            </section>


        </Layout>

    );
}


export default Security;