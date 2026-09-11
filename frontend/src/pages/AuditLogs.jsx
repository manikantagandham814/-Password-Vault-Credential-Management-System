import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/dashboard/dashboard.css";
import "../styles/security/security.css";


function AuditLogs() {

    const navigate = useNavigate();


    // =====================================================
    // PROFILE
    // =====================================================

    const [fullName, setFullName] =
        useState("");


    // =====================================================
    // AUDIT LOGS
    // =====================================================

    const [auditLogs, setAuditLogs] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadAuditLogs();

    }, []);


    async function loadAuditLogs() {

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
            // LOAD AUDIT LOGS
            // =================================================

            const auditResponse =
                await fetch(
                    "http://localhost:8082/api/security/audit-logs",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (
                auditResponse.status === 401
            ) {

                navigate("/login");

                return;

            }


            if (!auditResponse.ok) {

                throw new Error(
                    "Unable to load audit logs"
                );

            }


            const auditData =
                await auditResponse.json();


            setAuditLogs(
                Array.isArray(auditData)
                    ? auditData
                    : []
            );


        } catch (error) {

            console.error(
                "Audit logs error:",
                error
            );


            setError(
                "Unable to load audit logs"
            );


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
                            Loading Audit Logs...
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
                        Audit Logs
                    </h2>

                    <p>
                        History of important security events.
                    </p>

                </div>


                <button
                    type="button"
                    className="security-refresh"
                    onClick={loadAuditLogs}
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


        </Layout>

    );

}


export default AuditLogs;
