import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import "../styles/passwords/passwords.css";
import "../styles/dashboard/dashboard.css";


function Passwords() {

    const navigate = useNavigate();

    const [passwords, setPasswords] =
        useState([]);

    const [keyword, setKeyword] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [fullName, setFullName] =
        useState("Manikanta");

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [searchParams] =
        useSearchParams();


    // =====================================================
    // LOAD USER PROFILE
    // =====================================================

    useEffect(() => {

        async function loadUser() {

            try {

                const response =
                    await fetch(
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


                const data =
                    await response.json();


                if (!data.authenticated) {

                    navigate("/login");

                    return;
                }


                setFullName(
                    data.fullName || "Manikanta"
                );


            } catch (error) {

                console.error(
                    "Profile loading error:",
                    error
                );

            }

        }


        loadUser();

    }, [navigate]);


    // =====================================================
    // CLOSE PROFILE DROPDOWN
    // =====================================================

    useEffect(() => {

        function handleDocumentClick() {

            setProfileOpen(false);

        }


        document.addEventListener(
            "click",
            handleDocumentClick
        );


        return () => {

            document.removeEventListener(
                "click",
                handleDocumentClick
            );

        };

    }, []);


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

                    setKeyword(
                        searchKeyword
                    );

                } else {

                    setKeyword("");

                }


                const response =
                    await fetch(
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

                    alert(
                        "Access denied"
                    );

                    navigate(
                        "/dashboard"
                    );

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

    }, [
        navigate,
        searchParams
    ]);


    // =====================================================
    // SEARCH
    // =====================================================

    function handleSearch(e) {

        e.preventDefault();


        const trimmedKeyword =
            keyword.trim();


        if (
            trimmedKeyword === ""
        ) {

            navigate(
                "/passwords"
            );

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

            const response =
                await fetch(
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

                alert(
                    "Access denied"
                );

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
    // LOGOUT
    // =====================================================

    async function handleLogout(e) {

        e.preventDefault();


        try {

            await fetch(
                "http://localhost:8082/api/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );


        } catch (error) {

            console.error(
                "Logout error:",
                error
            );


        } finally {

            navigate("/login");

        }

    }


    // =====================================================
    // PROFILE BUTTON
    // =====================================================

    function toggleProfile(e) {

        e.stopPropagation();

        setProfileOpen(
            value => !value
        );

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="passwords-page dashboard-page">

                <header className="navbar">

                    {/* LOGO */}

                    <div className="logo">

                        <i
                            className="fa-solid fa-lock"
                            style={{
                                fontSize: "18px"
                            }}
                        ></i>

                        <span
                            style={{
                                fontSize: "20px"
                            }}
                        >
                            PasswordVault
                        </span>

                    </div>


                    {/* PROFILE */}

                    <div className="profile">

                        <button
                            type="button"
                            className="profile-btn"
                            onClick={
                                toggleProfile
                            }
                        >

                            <i
                                className="fa-solid fa-circle-user"
                                style={{
                                    fontSize: "17px"
                                }}
                            ></i>

                            <span
                                style={{
                                    fontSize: "14px"
                                }}
                            >
                                {fullName}
                            </span>

                            <i
                                className="fa-solid fa-angle-down"
                                style={{
                                    fontSize: "11px"
                                }}
                            ></i>

                        </button>

                    </div>

                </header>


                <div className="wrapper">

                    <aside className="sidebar">

                        <Link to="/dashboard">

                            <i
                                className="fa-solid fa-chart-line"
                                style={{
                                    fontSize: "15px"
                                }}
                            ></i>

                            <span
                                style={{
                                    fontSize: "14px"
                                }}
                            >
                                Overview
                            </span>

                        </Link>


                        <Link
                            to="/passwords"
                            className="active"
                        >

                            <i
                                className="fa-solid fa-key"
                                style={{
                                    fontSize: "15px"
                                }}
                            ></i>

                            <span
                                style={{
                                    fontSize: "14px"
                                }}
                            >
                                My Passwords
                            </span>

                        </Link>


                        <Link to="/add-password">

                            <i
                                className="fa-solid fa-plus"
                                style={{
                                    fontSize: "15px"
                                }}
                            ></i>

                            <span
                                style={{
                                    fontSize: "14px"
                                }}
                            >
                                Add Password
                            </span>

                        </Link>


                        <Link to="/inbox">

                            <i
                                className="fa-solid fa-inbox"
                                style={{
                                    fontSize: "15px"
                                }}
                            ></i>

                            <span
                                style={{
                                    fontSize: "14px"
                                }}
                            >
                                Inbox
                            </span>

                        </Link>


                        <Link to="/sent">

                            <i
                                className="fa-solid fa-paper-plane"
                                style={{
                                    fontSize: "15px"
                                }}
                            ></i>

                            <span
                                style={{
                                    fontSize: "14px"
                                }}
                            >
                                Sent
                            </span>

                        </Link>

                    </aside>


                    <main className="content">

                        <div className="loading">

                            Loading Passwords...

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="passwords-page dashboard-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="navbar">


                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="logo">

                    <i
                        className="fa-solid fa-lock"
                        style={{
                            fontSize: "18px"
                        }}
                    ></i>

                    <span
                        style={{
                            fontSize: "20px"
                        }}
                    >
                        PasswordVault
                    </span>

                </div>


                {/* =================================================
                    PROFILE
                ================================================= */}

                <div className="profile">

                    <button
                        type="button"
                        className="profile-btn"
                        onClick={
                            toggleProfile
                        }
                    >

                        <i
                            className="fa-solid fa-circle-user"
                            style={{
                                fontSize: "17px"
                            }}
                        ></i>

                        <span
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            {fullName}
                        </span>

                        <i
                            className="fa-solid fa-angle-down"
                            style={{
                                fontSize: "11px"
                            }}
                        ></i>

                    </button>


                    {/* =================================================
                        PROFILE DROPDOWN
                    ================================================= */}

                    {profileOpen && (

                        <div
                            className="dropdown show"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <Link to="/profile">

                                <i
                                    className="fa-solid fa-user"
                                    style={{
                                        fontSize: "14px"
                                    }}
                                ></i>

                                <span
                                    style={{
                                        fontSize: "14px"
                                    }}
                                >
                                    My Profile
                                </span>

                            </Link>


                            <hr />


                            <a
                                href="/login"
                                onClick={
                                    handleLogout
                                }
                            >

                                <i
                                    className="fa-solid fa-right-from-bracket"
                                    style={{
                                        fontSize: "14px"
                                    }}
                                ></i>

                                <span
                                    style={{
                                        fontSize: "14px"
                                    }}
                                >
                                    Logout
                                </span>

                            </a>

                        </div>

                    )}

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


                    {/* OVERVIEW */}

                    <Link to="/dashboard">

                        <i
                            className="fa-solid fa-chart-line"
                            style={{
                                fontSize: "15px"
                            }}
                        ></i>

                        <span
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            Overview
                        </span>

                    </Link>


                    {/* MY PASSWORDS */}

                    <Link
                        to="/passwords"
                        className="active"
                    >

                        <i
                            className="fa-solid fa-key"
                            style={{
                                fontSize: "15px"
                            }}
                        ></i>

                        <span
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            My Passwords
                        </span>

                    </Link>


                    {/* ADD PASSWORD */}

                    <Link to="/add-password">

                        <i
                            className="fa-solid fa-plus"
                            style={{
                                fontSize: "15px"
                            }}
                        ></i>

                        <span
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            Add Password
                        </span>

                    </Link>


                    {/* INBOX */}

                    <Link to="/inbox">

                        <i
                            className="fa-solid fa-inbox"
                            style={{
                                fontSize: "15px"
                            }}
                        ></i>

                        <span
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            Inbox
                        </span>

                    </Link>


                    {/* SENT */}

                    <Link to="/sent">

                        <i
                            className="fa-solid fa-paper-plane"
                            style={{
                                fontSize: "15px"
                            }}
                        ></i>

                        <span
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            Sent
                        </span>

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


                            {/* SEARCH */}

                            <form
                                onSubmit={
                                    handleSearch
                                }
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

                                    <i
                                        className="fa-solid fa-magnifying-glass"
                                        style={{
                                            fontSize: "13px"
                                        }}
                                    ></i>

                                </button>

                            </form>


                            {/* ADD NEW */}

                            <Link
                                to="/add-password"
                                className="add-btn"
                            >

                                <i
                                    className="fa-solid fa-plus"
                                    style={{
                                        fontSize: "13px"
                                    }}
                                ></i>

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
                                                key={
                                                    password.id
                                                }
                                            >


                                                {/* WEBSITE */}

                                                <td>

                                                    <i
                                                        className="fa-solid fa-globe"
                                                        style={{
                                                            fontSize: "14px"
                                                        }}
                                                    ></i>

                                                    <span>

                                                        {
                                                            password.websiteName
                                                        }

                                                    </span>

                                                </td>


                                                {/* USERNAME */}

                                                <td>

                                                    {
                                                        password.username
                                                    }

                                                </td>


                                                {/* CATEGORY */}

                                                <td>

                                                    <span className="category">

                                                        {
                                                            password.category ||
                                                            "Other"
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="actions">


                                                        {/* VIEW */}

                                                        <Link
                                                            to={`/view-password/${password.id}`}
                                                            title="View Password"
                                                            aria-label="View Password"
                                                        >

                                                            <i
                                                                className="fa-solid fa-eye view"
                                                                style={{
                                                                    fontSize: "15px"
                                                                }}
                                                            ></i>

                                                        </Link>


                                                        {/* EDIT */}

                                                        <Link
                                                            to={`/edit-password/${password.id}`}
                                                            title="Edit Password"
                                                            aria-label="Edit Password"
                                                        >

                                                            <i
                                                                className="fa-solid fa-pen edit"
                                                                style={{
                                                                    fontSize: "15px"
                                                                }}
                                                            ></i>

                                                        </Link>


                                                        {/* DELETE */}

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

                                                            <i
                                                                className="fa-solid fa-trash delete"
                                                                style={{
                                                                    fontSize: "15px"
                                                                }}
                                                            ></i>

                                                        </button>


                                                        {/* SHARE */}

                                                        <Link
                                                            to={`/share-password/${password.id}`}
                                                            title="Share Password"
                                                            aria-label="Share Password"
                                                        >

                                                            <i
                                                                className="fa-solid fa-share-nodes share"
                                                                style={{
                                                                    fontSize: "15px"
                                                                }}
                                                            ></i>

                                                        </Link>

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