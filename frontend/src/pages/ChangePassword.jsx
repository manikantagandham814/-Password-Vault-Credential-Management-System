import API_URL from "../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import "../styles/dashboard/dashboard.css";


function ChangePassword() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD USER
    // =====================================================

    useEffect(() => {

        async function loadUser() {

            try {

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

                    setError(
                        "Unable to load your account information. Please try again."
                    );

                    return;
                }


                const data =
                    await response.json();


                if (!data.authenticated) {

                    navigate("/login");

                    return;
                }


                setFullName(
                    data.fullName || ""
                );


            } catch (error) {

                console.error(
                    "User loading error:",
                    error
                );

                setError(
                    "Unable to connect to server. Please check your connection and try again."
                );

            } finally {

                setLoading(false);
            }
        }


        loadUser();

    }, [navigate]);


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (newPassword !== confirmPassword) {

            setError(
                "New Password and Confirm Password do not match"
            );

            return;
        }


        if (!currentPassword ||
            !newPassword ||
            !confirmPassword) {

            setError(
                "Please fill all fields"
            );

            return;
        }


        setSaving(true);


        try {

            const response = await fetch(
                `${API_URL}/api/change-password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        currentPassword:
                            currentPassword,

                        newPassword:
                            newPassword
                    })
                }
            );


            // Unauthorized session
            if (response.status === 401) {

                navigate("/login");

                return;
            }


            const message =
                await response.text();


            if (!response.ok) {

                setError(
                    message ||
                    "Unable to change password"
                );

                return;
            }


            setSuccess(
                message ||
                "Password Changed Successfully"
            );


            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");


        } catch (error) {

            console.error(
                "Change password error:",
                error
            );

            setError(
                "Unable to connect to server"
            );

        } finally {

            setSaving(false);
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
                            Loading...
                        </h3>

                    </div>

                </section>

            </Layout>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Layout fullName={fullName}>

            <section className="table-card">

                <div className="table-header">

                    <h3>
                        Change Password
                    </h3>

                </div>


                <div className="profile-body">

                    {error && (

                        <p className="error">
                            {error}
                        </p>

                    )}


                    {success && (

                        <p className="success">
                            {success}
                        </p>

                    )}


                    <form onSubmit={handleSubmit}>

                        {/* =================================
                            CURRENT PASSWORD
                        ================================= */}

                        <div className="form-group">

                            <label htmlFor="currentPassword">
                                Current Password
                            </label>

                            <input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* =================================
                            NEW PASSWORD
                        ================================= */}

                        <div className="form-group">

                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* =================================
                            CONFIRM PASSWORD
                        ================================= */}

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {/* =================================
                            BUTTON
                        ================================= */}

                        <div className="buttons">

                            <button
                                type="submit"
                                className="btn-save"
                                disabled={saving}
                            >

                                <i className="fa-solid fa-key"></i>

                                {saving
                                    ? "Changing..."
                                    : "Change Password"}

                            </button>

                        </div>

                    </form>

                </div>

            </section>

        </Layout>
    );
}


export default ChangePassword;