import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import Layout from "../components/Layout";
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
        useState("");

    const [error, setError] =
        useState("");

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
                    data.fullName || ""
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
    // LOAD PASSWORDS
    // =====================================================

    useEffect(() => {

        async function loadPasswords() {

            setLoading(true);
            setError("");

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

                    setError(
                        "Access denied. You do not have permission to view your passwords."
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


                if (
                    error instanceof TypeError
                ) {

                    setError(
                        "Unable to connect to server. Please check your connection and try again."
                    );

                } else {

                    setError(
                        "Unable to load passwords. Please try again."
                    );

                }

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
                    "Access denied. You do not have permission to delete this password."
                );

                return;
            }


            if (response.status === 404) {

                alert(
                    "Password not found. It may have already been deleted."
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


            if (
                error instanceof TypeError
            ) {

                alert(
                    "Unable to connect to server. Please check your connection and try again."
                );

            } else {

                alert(
                    "Unable to delete password. Please try again."
                );

            }

        }

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Layout
                fullName={fullName}
                pageClassName="passwords-page"
            >

                <div className="loading">

                    Loading Passwords...

                </div>

            </Layout>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <Layout
            fullName={fullName}
            pageClassName="passwords-page"
        >

            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="top-bar">

                <h2>
                    My Passwords
                </h2>


                <div className="top-actions">


                    {/* =================================================
                        SEARCH
                    ================================================= */}

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

                            <i className="fa-solid fa-magnifying-glass"></i>

                        </button>

                    </form>


                    {/* =================================================
                        ADD PASSWORD
                    ================================================= */}

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
                ERROR
            ================================================= */}

            {error && (

                <p className="error">

                    {error}

                </p>

            )}


            {/* =================================================
                PASSWORD TABLE
            ================================================= */}

            {!error && (

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

                                                <i className="fa-solid fa-globe"></i>

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

                                                        <i className="fa-solid fa-eye view"></i>

                                                    </Link>


                                                    {/* EDIT */}

                                                    <Link
                                                        to={`/edit-password/${password.id}`}
                                                        title="Edit Password"
                                                        aria-label="Edit Password"
                                                    >

                                                        <i className="fa-solid fa-pen edit"></i>

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

                                                        <i className="fa-solid fa-trash delete"></i>

                                                    </button>


                                                    {/* SHARE */}

                                                    <Link
                                                        to={`/share-password/${password.id}`}
                                                        title="Share Password"
                                                        aria-label="Share Password"
                                                    >

                                                        <i className="fa-solid fa-share-nodes share"></i>

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

            )}

        </Layout>

    );

}


export default Passwords;