import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/password-details/view-password.css";


function EditPassword() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        websiteName: "",
        websiteUrl: "",
        username: "",
        password: "",
        category: "Personal",
        notes: ""
    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD PASSWORD
    // =====================================================

    useEffect(() => {

        async function loadPassword() {

            try {

                const response = await fetch(
                    `http://localhost:8082/api/passwords/${id}/view`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


                if (response.status === 401) {

                    navigate("/login");

                    return;
                }


                if (response.status === 403) {

                    alert("Access denied");

                    navigate("/passwords");

                    return;
                }


                if (response.status === 404) {

                    navigate("/passwords");

                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        "Unable to load password"
                    );
                }


                const data = await response.json();


                setFormData({
                    websiteName: data.websiteName || "",
                    websiteUrl: data.websiteUrl || "",
                    username: data.username || "",
                    password: data.password || "",
                    category: data.category || "Personal",
                    notes: data.notes || ""
                });


            } catch (error) {

                console.error(
                    "Edit password load error:",
                    error
                );

                setError(
                    "Unable to load password"
                );

            } finally {

                setLoading(false);
            }
        }


        if (id) {

            loadPassword();

        } else {

            navigate("/passwords");

            setLoading(false);
        }

    }, [id, navigate]);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    function handleChange(e) {

        const { name, value } = e.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }


    // =====================================================
    // TOGGLE PASSWORD
    // =====================================================

    function togglePassword() {

        setShowPassword(
            (value) => !value
        );
    }


    // =====================================================
    // UPDATE PASSWORD
    // =====================================================

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSaving(true);


        try {

            const response = await fetch(
                `http://localhost:8082/api/passwords/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify(formData)
                }
            );


            if (response.status === 401) {

                navigate("/login");

                return;
            }


            if (response.status === 403) {

                setError("Access denied");

                return;
            }


            if (response.status === 404) {

                setError(
                    "Password not found"
                );

                return;
            }


            if (!response.ok) {

                const message =
                    await response.text();

                setError(
                    message ||
                    "Unable to update password"
                );

                return;
            }


            alert(
                "Password Updated Successfully!"
            );

            navigate("/passwords");


        } catch (error) {

            console.error(
                "Update password error:",
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

            <div className="view-password-page">

                <div className="card">

                    <h2>

                        <i className="fa-solid fa-pen"></i>

                        Loading Password...

                    </h2>

                </div>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="view-password-page">

            <div className="card">


                {/* =================================================
                    HEADING
                ================================================= */}

                <h2>

                    <i className="fa-solid fa-pen"></i>

                    Edit Password

                </h2>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                <form onSubmit={handleSubmit}>


                    {/* =================================================
                        WEBSITE NAME
                    ================================================= */}

                    <div className="row edit-field">

                        <label htmlFor="websiteName">
                            Website Name
                        </label>

                        <input
                            id="websiteName"
                            type="text"
                            name="websiteName"
                            value={formData.websiteName}
                            onChange={handleChange}
                            placeholder="Website name"
                            required
                        />

                    </div>


                    {/* =================================================
                        WEBSITE URL
                    ================================================= */}

                    <div className="row edit-field">

                        <label htmlFor="websiteUrl">
                            Website URL
                        </label>

                        <input
                            id="websiteUrl"
                            type="url"
                            name="websiteUrl"
                            value={formData.websiteUrl}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />

                    </div>


                    {/* =================================================
                        USERNAME
                    ================================================= */}

                    <div className="row edit-field">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username or email"
                            required
                        />

                    </div>


                    {/* =================================================
                        PASSWORD
                    ================================================= */}

                    <div className="row edit-field">

                        <label htmlFor="password">
                            Password
                        </label>


                        <div className="password-box">

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />


                            <button
                                type="button"
                                onClick={togglePassword}
                                title={
                                    showPassword
                                        ? "Hide Password"
                                        : "Show Password"
                                }
                            >

                                <i
                                    className={
                                        showPassword
                                            ? "fa-solid fa-eye-slash"
                                            : "fa-solid fa-eye"
                                    }
                                ></i>

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        CATEGORY
                    ================================================= */}

                    <div className="row edit-field">

                        <label htmlFor="category">
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >

                            <option value="Personal">
                                Personal
                            </option>

                            <option value="Work">
                                Work
                            </option>

                            <option value="Social">
                                Social
                            </option>

                            <option value="Banking">
                                Banking
                            </option>

                            <option value="Shopping">
                                Shopping
                            </option>

                            <option value="Others">
                                Others
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        NOTES
                    ================================================= */}

                    <div className="row edit-field notes-field">

                        <label htmlFor="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            name="notes"
                            rows="4"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add notes..."
                        ></textarea>

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="buttons">

                        <button
                            type="submit"
                            disabled={saving}
                        >

                            <i className="fa-solid fa-floppy-disk"></i>

                            {saving
                                ? "Updating..."
                                : "Update Password"
                            }

                        </button>


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/passwords")
                            }
                            disabled={saving}
                        >

                            Cancel

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default EditPassword;