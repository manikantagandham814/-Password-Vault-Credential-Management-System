import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import "../styles/passwords/passwords.css";

function Passwords() {

    const navigate = useNavigate();

    const [passwords, setPasswords] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();


    // =====================================================
    // LOAD PASSWORDS
    // =====================================================

    useEffect(() => {

        async function loadPasswords() {

            setLoading(true);

            try {

                const searchKeyword =
                    searchParams.get("keyword");


                let url =
                    "http://localhost:8082/api/passwords";


                if (searchKeyword) {

                    url =
                        `http://localhost:8082/api/passwords/search?keyword=${encodeURIComponent(searchKeyword)}`;

                    setKeyword(searchKeyword);

                } else {

                    setKeyword("");

                }


                const response = await fetch(
                    url,
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

                    navigate("/dashboard");

                    return;
                }


                if (!response.ok) {

                    throw new Error(
                        "Unable to load passwords"
                    );
                }


                const data =
                    await response.json();


                setPasswords(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (error) {

                console.error(
                    "Passwords error:",
                    error
                );

                alert(
                    "Unable to load passwords"
                );

            } finally {

                setLoading(false);

            }
        }


        loadPasswords();

    }, [navigate, searchParams]);


    // =====================================================
    // SEARCH
    // =====================================================

    function handleSearch(e) {

        e.preventDefault();

        const trimmedKeyword =
            keyword.trim();


        if (trimmedKeyword === "") {

            navigate("/passwords");

            return;
        }


        navigate(
            `/passwords?keyword=${encodeURIComponent(trimmedKeyword)}`
        );
    }


    // =====================================================
    // DELETE PASSWORD
    // =====================================================

    async function handleDelete(id) {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this password?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8082/api/passwords/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );


            if (response.status === 401) {

                navigate("/login");

                return;
            }


            if (response.status === 403) {

                alert("Access denied");

                return;
            }


            if (response.status === 404) {

                alert(
                    "Password not found"
                );

                setPasswords(
                    previous =>
                        previous.filter(
                            password =>
                                password.id !== id
                        )
                );

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Unable to delete password"
                );
            }


            setPasswords(
                previous =>
                    previous.filter(
                        password =>
                            password.id !== id
                    )
            );


        } catch (error) {

            console.error(
                "Delete password error:",
                error
            );

            alert(
                "Unable to delete password"
            );
        }
    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="passwords-page">

                <header className="navbar">

                    <div className="logo">

                        <i className="fa-solid fa-lock"></i>

                        <span>
                            PasswordVault
                        </span>

                    </div>

                </header>


                <main className="content">

                    <div className="loading">

                        Loading Passwords...

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="passwords-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="navbar">

                <div className="logo">

                    <i className="fa-solid fa-lock"></i>

                    <span>
                        PasswordVault
                    </span>

                </div>


                <div className="profile">

                    <i className="fa-solid fa-circle-user"></i>

                    <span>
                        Passwords
                    </span>

                </div>

            </header>


            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="wrapper">


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="sidebar">

                    <Link to="/dashboard">

                        <i className="fa-solid fa-chart-line"></i>

                        Dashboard

                    </Link>


                    <Link
                        to="/passwords"
                        className="active"
                    >

                        <i className="fa-solid fa-key"></i>

                        My Passwords

                    </Link>


                    <Link to="/add-password">

                        <i className="fa-solid fa-plus"></i>

                        Add Password

                    </Link>

                </aside>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="content">


                    {/* =================================================
                        TOP BAR
                    ================================================= */}

                    <div className="top-bar">

                        <h2>
                            My Passwords
                        </h2>


                        <div className="top-actions">


                            {/* Search */}

                            <form
                                onSubmit={handleSearch}
                            >

                                <input
                                    type="text"
                                    name="keyword"
                                    placeholder="Search Website..."
                                    value={keyword}
                                    onChange={(e) =>
                                        setKeyword(
                                            e.target.value
                                        )
                                    }
                                    aria-label="Search passwords"
                                />


                                <button
                                    type="submit"
                                    title="Search"
                                >

                                    <i className="fa-solid fa-magnifying-glass"></i>

                                </button>

                            </form>


                            {/* Add Password */}

                            <Link
                                to="/add-password"
                                className="add-btn"
                            >

                                <i className="fa-solid fa-plus"></i>

                                {" "}Add New

                            </Link>

                        </div>

                    </div>


                    {/* =================================================
                        PASSWORD TABLE
                    ================================================= */}

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Website
                                    </th>

                                    <th>
                                        Username
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {passwords.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="empty"
                                        >

                                            {keyword
                                                ? "No passwords found"
                                                : "No Passwords Saved Yet"
                                            }

                                        </td>

                                    </tr>

                                ) : (

                                    passwords.map(
                                        (password) => (

                                            <tr
                                                key={password.id}
                                            >

                                                {/* Website */}

                                                <td>

                                                    <i className="fa-solid fa-globe"></i>

                                                    <span>
                                                        {password.websiteName}
                                                    </span>

                                                </td>


                                                {/* Username */}

                                                <td>
                                                    {password.username}
                                                </td>


                                                {/* Category */}

                                                <td>

                                                    <span className="category">

                                                        {password.category || "Other"}

                                                    </span>

                                                </td>


                                                {/* Actions */}

                                                <td>

                                                    <div className="actions">


                                                        {/* View */}

                                                        <Link
                                                            to={`/view-password/${password.id}`}
                                                            title="View Password"
                                                            aria-label="View Password"
                                                        >

                                                            <i className="fa-solid fa-eye view"></i>

                                                        </Link>


                                                        {/* Edit */}

                                                        <Link
                                                            to={`/edit-password/${password.id}`}
                                                            title="Edit Password"
                                                            aria-label="Edit Password"
                                                        >

                                                            <i className="fa-solid fa-pen edit"></i>

                                                        </Link>


                                                        {/* Delete */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    password.id
                                                                )
                                                            }
                                                            title="Delete Password"
                                                            aria-label="Delete Password"
                                                        >

                                                            <i className="fa-solid fa-trash delete"></i>

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Passwords;