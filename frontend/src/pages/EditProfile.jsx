import API_URL from "../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/profile/profile.css";

function EditProfile() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editing, setEditing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // Load Profile
    // =====================================================

    useEffect(() => {

        async function loadProfile() {

            try {

                const response = await fetch(
                    `${API_URL}/api/profile`,
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


                if (error instanceof TypeError) {

                    setError(
                        "Unable to connect to server. Please check your connection and try again."
                    );

                } else {

                    setError(
                        "Unable to load your profile. Please try again."
                    );

                }

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


        if (!fullName.trim()) {

            setError(
                "Full Name cannot be empty"
            );

            return;
        }


        setSaving(true);


        try {

            const response = await fetch(
                `${API_URL}/api/profile`,
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

                const technicalError =
                    /Exception|at org\.|at java\.|StackTrace|Error:/i.test(
                        message
                    );

                if (
                    technicalError ||
                    !message.trim()
                ) {

                    setError(
                        "Unable to update your profile. Please try again."
                    );

                } else {

                    setError(
                        message
                    );

                }

                return;
            }


            setFullName(
                fullName.trim()
            );


            setSuccess(
                "Profile updated successfully"
            );


            setEditing(false);


        } catch (error) {

            console.error(
                "Update profile error:",
                error
            );


            setError(
                "Unable to connect to server. Please check your connection and try again."
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

                            <i className="fa-solid fa-user"></i>

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
    // PROFILE PAGE
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

                        <i
                            className={
                                editing
                                    ? "fa-solid fa-user-pen"
                                    : "fa-solid fa-user"
                            }
                        ></i>

                        <h2>
                            {editing
                                ? "Edit Profile"
                                : "My Profile"
                            }
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


                        {/* =================================================
                            VIEW PROFILE
                        ================================================= */}

                        {!editing && (

                            <div>

                                <div className="form-group">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={fullName}
                                        readOnly
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                    />

                                </div>


                                <div className="buttons">

                                    <button
                                        type="button"
                                        className="btn-save"
                                        onClick={() => {
                                            setError("");
                                            setSuccess("");
                                            setEditing(true);
                                        }}
                                    >

                                        <i className="fa-solid fa-pen"></i>

                                        Edit Profile

                                    </button>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            EDIT PROFILE
                        ================================================= */}

                        {editing && (

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


                                    <button
                                        type="button"
                                        className="btn-back"
                                        onClick={() => {
                                            setError("");
                                            setSuccess("");
                                            setEditing(false);
                                        }}
                                    >

                                        <i className="fa-solid fa-xmark"></i>

                                        Cancel

                                    </button>

                                </div>


                            </form>

                        )}

                    </div>

                </div>

            </main>

        </div>

    );

}


export default EditProfile;