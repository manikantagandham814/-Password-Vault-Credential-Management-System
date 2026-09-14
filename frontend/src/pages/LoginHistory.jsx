import API_URL from "../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/login-history.css";

function LoginHistory() {

    const navigate = useNavigate();

    const [fullName, setFullName] =
        useState("");

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD LOGIN HISTORY
    // =====================================================

    useEffect(() => {

        let mounted = true;


        async function loadLoginHistory() {

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/login-history`,
                        {
                            method: "GET",
                            credentials: "include"
                        }
                    );


                // =========================================
                // NOT LOGGED IN
                // =========================================

                if (response.status === 401) {

                    navigate("/login");

                    return;
                }


                // =========================================
                // OTHER ERROR
                // =========================================

                if (!response.ok) {

                    throw new Error(
                        "Unable to load login history"
                    );
                }


                const data =
                    await response.json();


                if (!mounted) {

                    return;
                }


                setHistory(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (error) {

                console.error(
                    "Login history error:",
                    error
                );


                if (mounted) {

                    if (error instanceof TypeError) {

                        setError(
                            "Unable to connect to server. Please check your connection and try again."
                        );

                    } else {

                        setError(
                            "Unable to load login history. Please try again."
                        );

                    }

                }


            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        }


        loadLoginHistory();


        return () => {

            mounted = false;

        };

    }, [navigate]);


    // =====================================================
    // LOAD CURRENT USER NAME
    // =====================================================

    useEffect(() => {

        let mounted = true;


        async function loadUser() {

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/dashboard`,
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
                    mounted &&
                    data.authenticated
                ) {

                    setFullName(
                        data.fullName || ""
                    );

                }


            } catch (error) {

                console.error(
                    "User loading error:",
                    error
                );

            }

        }


        loadUser();


        return () => {

            mounted = false;

        };

    }, [navigate]);


    // =====================================================
    // FORMAT DATE & TIME
    // =====================================================

    function formatDateTime(value) {

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
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    }


    // =====================================================
    // STATUS CLASS
    // =====================================================

    function getStatusClass(status) {

        if (
            String(status)
                .toUpperCase()
                === "SUCCESS"
        ) {

            return "success";

        }


        return "failed";

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout
                fullName={fullName}
                pageClassName="login-history-page"
            >

                <section className="table-card">

                    <div className="table-header">

                        <h3>
                            Loading Login History...
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
            pageClassName="login-history-page"
        >

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="welcome">

                <h2>
                    Login History
                </h2>


                <p>
                    View your recent successful and unsuccessful login attempts.
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
                LOGIN HISTORY TABLE
            ================================================= */}

            <section className="table-card">


                <div className="table-header">

                    <h3>
                        Recent Login Activity
                    </h3>

                </div>


                {history.length === 0 ? (

                    <div className="empty">

                        <i className="fa-solid fa-clock-rotate-left"></i>

                        <h3>
                            No Login History
                        </h3>

                        <p>
                            Your login activity will appear here.
                        </p>

                    </div>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Date & Time
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {history.map(
                                (item) => (

                                    <tr
                                        key={item.id}
                                    >

                                        <td>

                                            <i className="fa-solid fa-envelope"></i>

                                            <span>
                                                {" "}
                                                {item.email}
                                            </span>

                                        </td>


                                        <td>

                                            <span
                                                className={`login-status ${getStatusClass(
                                                    item.status
                                                )}`}
                                            >

                                                <i
                                                    className={
                                                        String(
                                                            item.status
                                                        )
                                                            .toUpperCase()
                                                            === "SUCCESS"
                                                            ? "fa-solid fa-circle-check"
                                                            : "fa-solid fa-circle-xmark"
                                                    }
                                                ></i>

                                                {" "}

                                                {item.status}

                                            </span>

                                        </td>


                                        <td>

                                            <i className="fa-regular fa-clock"></i>

                                            {" "}

                                            {formatDateTime(
                                                item.loginTime
                                            )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </section>

        </Layout>

    );
}

export default LoginHistory;