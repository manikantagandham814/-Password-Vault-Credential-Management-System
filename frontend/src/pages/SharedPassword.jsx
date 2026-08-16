import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../styles/sharing/shared-password.css";

function SharedPassword() {

    const { shareId } = useParams();

    const navigate = useNavigate();

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function load() {

            try {

                const response =
                    await fetch(
                        `http://localhost:8082/api/shares/${shareId}`,
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
                        "You do not have access to this password."
                    );

                    return;
                }


                if (!response.ok) {

                    setError(
                        await response.text()
                    );

                    return;
                }


                const result =
                    await response.json();

                setData(result);

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load shared password"
                );

            } finally {

                setLoading(false);
            }
        }


        load();

    }, [shareId, navigate]);


    if (loading) {

        return (
            <div className="shared-password-page">
                <div className="card">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }


    if (error) {

        return (
            <div className="shared-password-page">

                <div className="card">

                    <h2>
                        Access Denied
                    </h2>

                    <p className="error">
                        {error}
                    </p>

                    <Link to="/inbox">
                        Back to Inbox
                    </Link>

                </div>

            </div>
        );
    }


    if (!data) {
        return null;
    }


    return (

        <div className="shared-password-page">

            <div className="card">

                <h2>
                    <i className="fa-solid fa-share-nodes"></i>
                    Shared Password
                </h2>


                <div className="row">

                    <label>
                        Website
                    </label>

                    <p>
                        {data.websiteName}
                    </p>

                </div>


                <div className="row">

                    <label>
                        Website URL
                    </label>

                    <p>
                        {data.websiteUrl || "-"}
                    </p>

                </div>


                <div className="row">

                    <label>
                        Username
                    </label>

                    <p>
                        {data.username}
                    </p>

                </div>


                <div className="row">

                    <label>
                        Password
                    </label>

                    <div className="password-box">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={data.password}
                            readOnly
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    value => !value
                                )
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


                <div className="row">

                    <label>
                        Category
                    </label>

                    <p>
                        {data.category || "-"}
                    </p>

                </div>


                <div className="row">

                    <label>
                        Notes
                    </label>

                    <p>
                        {data.notes || "-"}
                    </p>

                </div>


                <div className="permission-box">

                    <strong>
                        Your Permission
                    </strong>

                    <span>
                        {data.permission}
                    </span>

                </div>


                <div className="buttons">

                    <Link to="/inbox">
                        Back to Inbox
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default SharedPassword;