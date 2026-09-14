import API_URL from "../config";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../styles/sharing/share-password.css";

function SharePassword() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [permission, setPermission] =
        useState("VIEW_ONLY");

    const [password, setPassword] =
        useState(null);

    const [shares, setShares] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // Load password + existing shares
    // =====================================================

    useEffect(() => {

        async function loadData() {

            try {

                const passwordResponse =
                    await fetch(
                        `${API_URL}/api/passwords/${id}/view`,
                        {
                            credentials: "include"
                        }
                    );


                if (
                    passwordResponse.status === 401
                ) {

                    navigate("/login");
                    return;
                }


                if (
                    passwordResponse.status === 403
                ) {

                    setError(
                        "You do not have permission to access this password."
                    );

                    return;
                }


                if (
                    passwordResponse.status === 404
                ) {

                    setError(
                        "Password not found."
                    );

                    return;
                }


                if (!passwordResponse.ok) {

                    throw new Error(
                        "Unable to load password"
                    );
                }


                const passwordData =
                    await passwordResponse.json();

                setPassword(passwordData);


                const sharesResponse =
                    await fetch(
                        `${API_URL}/api/shares/password/${id}`,
                        {
                            credentials: "include"
                        }
                    );


                if (
                    sharesResponse.status === 401
                ) {

                    navigate("/login");
                    return;
                }


                if (
                    sharesResponse.status === 403
                ) {

                    setError(
                        "You do not have permission to manage sharing."
                    );

                    return;
                }


                if (
                    sharesResponse.status === 404
                ) {

                    setError(
                        "Password sharing information was not found."
                    );

                    return;
                }


                if (!sharesResponse.ok) {

                    throw new Error(
                        "Unable to load shares"
                    );
                }


                const sharesData =
                    await sharesResponse.json();

                setShares(sharesData);

            } catch (error) {

                console.error(
                    "Share data loading error:",
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
                        "Unable to load sharing information. Please try again."
                    );

                }

            } finally {

                setLoading(false);
            }
        }


        loadData();

    }, [id, navigate]);


    // =====================================================
    // Share
    // =====================================================

    async function handleShare(e) {

        e.preventDefault();

        setError("");
        setSuccess("");

        setSaving(true);


        try {

            const response =
                await fetch(
                    `${API_URL}/api/shares`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({
                            passwordId:
                                Number(id),

                            recipientEmail:
                                email,

                            permission:
                                permission
                        })
                    }
                );


            if (
                response.status === 401
            ) {

                navigate("/login");
                return;
            }


            const message =
                await response.text();


            if (!response.ok) {

                if (
                    response.status === 403
                ) {

                    setError(
                        "You do not have permission to share this password."
                    );

                } else if (
                    response.status === 404
                ) {

                    setError(
                        "Password or recipient was not found."
                    );

                } else if (
                    response.status === 409
                ) {

                    setError(
                        "This password has already been shared with this user."
                    );

                } else if (
                    response.status === 400
                ) {

                    setError(
                        "Please check the recipient email and permission."
                    );

                } else {

                    setError(
                        "Unable to share password. Please try again."
                    );

                }

                return;
            }


            setSuccess(
                message ||
                "Password shared successfully."
            );

            setEmail("");
            setPermission("VIEW_ONLY");


            await reloadShares();

        } catch (error) {

            console.error(
                "Share password error:",
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
                    "Unable to share password. Please try again."
                );

            }

        } finally {

            setSaving(false);
        }
    }


    // =====================================================
    // Reload shares
    // =====================================================

    async function reloadShares() {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/shares/password/${id}`,
                    {
                        credentials: "include"
                    }
                );


            if (
                response.status === 401
            ) {

                navigate("/login");
                return;
            }


            if (
                response.status === 403
            ) {

                setError(
                    "You do not have permission to manage sharing."
                );

                return;
            }


            if (response.ok) {

                const data =
                    await response.json();

                setShares(data);

            } else {

                setError(
                    "Unable to refresh sharing information. Please try again."
                );

            }

        } catch (error) {

            console.error(
                "Reload shares error:",
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
                    "Unable to refresh sharing information. Please try again."
                );

            }

        }
    }


    // =====================================================
    // Change permission
    // =====================================================

    async function changePermission(
        shareId,
        currentPermission
    ) {

        const newPermission =
            window.prompt(
                "Enter permission:\nVIEW_ONLY\nEDIT\nFULL_MANAGEMENT",
                currentPermission
            );


        if (!newPermission) {
            return;
        }


        const normalized =
            newPermission
                .trim()
                .toUpperCase();


        if (
            ![
                "VIEW_ONLY",
                "EDIT",
                "FULL_MANAGEMENT"
            ].includes(normalized)
        ) {

            alert("Invalid permission");
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/shares/${shareId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({
                            permission:
                                normalized
                        })
                    }
                );


            if (
                response.status === 401
            ) {

                navigate("/login");
                return;
            }


            if (!response.ok) {

                if (
                    response.status === 403
                ) {

                    alert(
                        "You do not have permission to change this sharing permission."
                    );

                } else if (
                    response.status === 404
                ) {

                    alert(
                        "Sharing record not found."
                    );

                } else if (
                    response.status === 400
                ) {

                    alert(
                        "Invalid permission. Please select a valid permission."
                    );

                } else {

                    alert(
                        "Unable to update permission. Please try again."
                    );

                }

                return;
            }


            await reloadShares();

        } catch (error) {

            console.error(
                "Update permission error:",
                error
            );


            if (
                error instanceof TypeError
            ) {

                alert(
                    "Unable to connect to server. Please check your connection and try again."
                );

            } else {

                alert(
                    "Unable to update permission. Please try again."
                );

            }
        }
    }


    // =====================================================
    // Remove access
    // =====================================================

    async function removeAccess(
        shareId
    ) {

        if (
            !window.confirm(
                "Remove access for this user?"
            )
        ) {

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/shares/${shareId}`,
                    {
                        method: "DELETE",

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

                if (
                    response.status === 403
                ) {

                    alert(
                        "You do not have permission to remove this user's access."
                    );

                } else if (
                    response.status === 404
                ) {

                    alert(
                        "Sharing record not found."
                    );

                } else {

                    alert(
                        "Unable to remove access. Please try again."
                    );

                }

                return;
            }


            await reloadShares();

        } catch (error) {

            console.error(
                "Remove access error:",
                error
            );


            if (
                error instanceof TypeError
            ) {

                alert(
                    "Unable to connect to server. Please check your connection and try again."
                );

            } else {

                alert(
                    "Unable to remove access. Please try again."
                );

            }
        }
    }


    // =====================================================
    // Loading
    // =====================================================

    if (loading) {

        return (
            <div className="share-page">

                <div className="share-card">

                    <h2>Loading...</h2>

                </div>

            </div>
        );
    }


    return (

        <div className="share-page">

            <div className="share-card">

                <div className="share-header">

                    <i className="fa-solid fa-share-nodes"></i>

                    <h2>
                        Share Password
                    </h2>

                </div>


                <div className="share-body">

                    {error && (
                        <p className="share-error">
                            {error}
                        </p>
                    )}


                    {success && (
                        <p className="share-success">
                            {success}
                        </p>
                    )}


                    {password && (

                        <div className="credential-box">

                            <span>
                                Website
                            </span>

                            <strong>
                                {password.websiteName}
                            </strong>

                        </div>
                    )}


                    <form
                        onSubmit={handleShare}
                    >

                        <div className="input-group">

                            <label>
                                Recipient Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter registered email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Permission
                            </label>

                            <select
                                value={permission}
                                onChange={(e) =>
                                    setPermission(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="VIEW_ONLY">
                                    View Only
                                </option>

                                <option value="EDIT">
                                    Edit Access
                                </option>

                                <option value="FULL_MANAGEMENT">
                                    Full Management
                                </option>

                            </select>

                        </div>


                        <button
                            type="submit"
                            disabled={saving}
                        >

                            <i className="fa-solid fa-share-nodes"></i>

                            {saving
                                ? "Sharing..."
                                : "Share Password"
                            }

                        </button>

                    </form>


                    <div className="existing-shares">

                        <h3>
                            Current Access
                        </h3>


                        {shares.length === 0 ? (

                            <p className="empty">
                                No users have access.
                            </p>

                        ) : (

                            shares.map((share) => (

                                <div
                                    className="share-row"
                                    key={share.shareId}
                                >

                                    <div>

                                        <strong>
                                            {share.recipientName}
                                        </strong>

                                        <span>
                                            {share.recipientEmail}
                                        </span>

                                    </div>


                                    <span className="permission">
                                        {share.permission}
                                    </span>


                                    <div className="share-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                changePermission(
                                                    share.shareId,
                                                    share.permission
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="remove"
                                            onClick={() =>
                                                removeAccess(
                                                    share.shareId
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))
                        )}

                    </div>


                    <Link
                        to="/passwords"
                        className="back-link"
                    >
                        ← Back to Passwords
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default SharePassword;