import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/dashboard/dashboard.css";
import "../styles/security/security.css";


function SuspiciousActivity() {

    const navigate = useNavigate();


    // =====================================================
    // PROFILE
    // =====================================================

    const [fullName, setFullName] =
        useState("");


    // =====================================================
    // SUSPICIOUS ACTIVITY
    // =====================================================

    const [suspicious, setSuspicious] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadSuspiciousActivity();

    }, []);


    async function loadSuspiciousActivity() {

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
            // LOAD SUSPICIOUS ACTIVITY
            // =================================================

            const suspiciousResponse =
                await fetch(
                    "http://localhost:8082/api/security/suspicious",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (
                suspiciousResponse.status === 401
            ) {

                navigate("/login");

                return;

            }


            if (!suspiciousResponse.ok) {

                throw new Error(
                    "Unable to load suspicious activity"
                );

            }


            const suspiciousData =
                await suspiciousResponse.json();


            setSuspicious(
                Array.isArray(suspiciousData)
                    ? suspiciousData
                    : []
            );


        } catch (error) {

            console.error(
                "Suspicious activity error:",
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
                    "Unable to load suspicious activity. Please try again."
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
                            Loading Suspicious Activity...
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
                        Suspicious Activity
                    </h2>

                    <p>
                        Review unusual activity detected on your account.
                    </p>

                </div>


                <button
                    type="button"
                    className="security-refresh"
                    onClick={loadSuspiciousActivity}
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


        </Layout>

    );

}


export default SuspiciousActivity;