import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "../styles/profile/profile.css";


function EditProfile() {

    const navigate = useNavigate();


    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // Load Profile
    // =====================================================

    useEffect(() => {

        async function loadProfile() {

            try {

                const response = await fetch(
                    "http://localhost:8082/api/profile",
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

                    throw new Error(
                        "Unable to load profile"
                    );
                }


                const data =
                    await response.json();


                setFullName(
                    data.fullName || ""
                );

                setEmail(
                    data.email || ""
                );


            } catch (error) {

                console.error(
                    "Profile error:",
                    error
                );

                setError(
                    "Unable to load profile"
                );

            } finally {

                setLoading(false);
            }
        }


        loadProfile();

    }, [navigate]);


    // =====================================================
    // Update Profile
    // =====================================================

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        setSuccess("");

        setSaving(true);


        try {

            const response = await fetch(
                "http://localhost:8082/api/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        fullName: fullName.trim()
                    })
                }
            );


            if (response.status === 401) {

                navigate("/login");

                return;
            }


            if (!response.ok) {

                const message =
                    await response.text();

                setError(
                    message ||
                    "Unable to update profile"
                );

                return;
            }


            setSuccess(
                "Profile updated successfully"
            );


            setTimeout(() => {

                navigate("/profile");

            }, 700);


        } catch (error) {

            console.error(
                "Update profile error:",
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
    // Loading
    // =====================================================

    if (loading) {

        return (

            <div className="profile-page">

                <header className="navbar">

                    <div className="logo">

                        <i className="fa-solid fa-lock"></i>

                        PasswordVault

                    </div>

                </header>


                <div className="container">

                    <div className="profile-card">

                        <div className="profile-header">

                            <i className="fa-solid fa-user-pen"></i>

                            <h2>
                                Loading Profile...
                            </h2>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="profile-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="navbar">

                <div className="logo">

                    <i className="fa-solid fa-lock"></i>

                    PasswordVault

                </div>


                <div className="profile-name">

                    <i className="fa-solid fa-circle-user"></i>

                    <span>
                        {fullName}
                    </span>

                </div>

            </header>


            {/* =================================================
                CONTAINER
            ================================================= */}

            <main className="container">

                <div className="profile-card">


                    {/* =================================================
                        PROFILE HEADER
                    ================================================= */}

                    <div className="profile-header">

                        <i className="fa-solid fa-user-pen"></i>

                        <h2>
                            Edit Profile
                        </h2>

                    </div>


                    {/* =================================================
                        PROFILE BODY
                    ================================================= */}

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


                            {/* =========================================
                                FULL NAME
                            ========================================= */}

                            <div className="form-group">

                                <label htmlFor="fullName">
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {/* =========================================
                                EMAIL
                            ========================================= */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    readOnly
                                />

                            </div>


                            {/* =========================================
                                BUTTONS
                            ========================================= */}

                            <div className="buttons">

                                <button
                                    type="submit"
                                    className="btn-save"
                                    disabled={saving}
                                >

                                    <i className="fa-solid fa-floppy-disk"></i>

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"
                                    }

                                </button>


                                <Link
                                    to="/profile"
                                    className="btn-back"
                                >

                                    <i className="fa-solid fa-xmark"></i>

                                    Cancel

                                </Link>

                            </div>

                        </form>

                    </div>

                </div>

            </main>

        </div>
    );
}


export default EditProfile;