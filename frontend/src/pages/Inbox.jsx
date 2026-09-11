import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/dashboard/dashboard.css";

function Inbox() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            const response = await fetch(
                "http://localhost:8082/api/shares/inbox",
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
                throw new Error("Unable to load inbox");
            }

            const data = await response.json();

            setItems(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {
            console.error("Inbox error:", err);

            if (err instanceof TypeError) {
                setError(
                    "Unable to connect to server. Please check your connection and try again."
                );
            } else {
                setError(
                    "Unable to load shared passwords. Please try again."
                );
            }

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
                    return;
                }

                const data = await response.json();

                if (!data.authenticated) {
                    navigate("/login");
                    return;
                }

                setFullName(
                    data.fullName || ""
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
    // FORMAT PERMISSION
    // =====================================================

    function formatPermission(permission) {
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

    async function handleDelete(shareId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this password?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8082/api/shares/${shareId}/password`,
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
                const message = await response.text();

                const technicalError =
                    /Exception|at org\.|at java\.|StackTrace|Error:/i.test(
                        message
                    );

                if (
                    technicalError ||
                    !message.trim()
                ) {
                    alert(
                        "Unable to delete password. Please try again."
                    );
                } else {
                    alert(message);
                }

                return;
            }

            alert("Password deleted successfully");

            await loadInbox();

        } catch (err) {
            console.error(
                "Delete shared password error:",
                err
            );

            alert(
                "Unable to connect to server. Please check your connection and try again."
            );
        }
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
                            Loading Inbox...
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
        <Layout fullName={fullName}>

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
                                textAlign: "center",
                                padding: "40px"
                            }}
                        >
                            <i
                                className="fa-solid fa-inbox"
                                style={{
                                    fontSize: "35px",
                                    marginBottom: "15px"
                                }}
                            ></i>

                            <p>
                                Passwords shared
                                with you will
                                appear here.
                            </p>
                        </div>

                    </section>
                )}

            {/* =================================================
                INBOX TABLE
            ================================================= */}

            {!error &&
                items.length > 0 && (
                    <section className="table-card">

                        <div className="table-header">
                            <h3>
                                Passwords Shared With You
                            </h3>
                        </div>

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

                                {items.map((item) => {

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
                                        <tr key={shareId}>

                                            {/* WEBSITE */}

                                            <td>

                                                <i className="fa-solid fa-globe"></i>

                                                <span>
                                                    {" "}
                                                    {item.websiteName}
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

                                                <span className="permission">

                                                    {
                                                        formatPermission(
                                                            permission
                                                        )
                                                    }

                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="actions">

                                                    {/* VIEW */}

                                                    <Link
                                                        to={`/shared-password/${shareId}`}
                                                        className="view"
                                                        title="View Password"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </Link>

                                                    {/* EDIT */}

                                                    {canEdit && (
                                                        <Link
                                                            to={`/edit-password/${passwordId}`}
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
                                                            to={`/share-password/${passwordId}`}
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
                                })}

                            </tbody>

                        </table>

                    </section>
                )}

        </Layout>
    );
}

export default Inbox;