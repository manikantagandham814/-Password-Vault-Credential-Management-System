import API_URL from "../config";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ fullName }) {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        function handleDocumentClick() {
            setProfileOpen(false);
        }

        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    async function handleLogout(e) {
        e.preventDefault();

        try {
            await fetch(`${API_URL}/api/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            navigate("/login");
        }
    }

    return (
        <header className="navbar">
            <div className="logo">
                <i className="fa-solid fa-lock"></i>
                <span>PasswordVault</span>
            </div>

            <div className="profile">
                <button
                    type="button"
                    className="profile-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setProfileOpen((value) => !value);
                    }}
                >
                    <i className="fa-solid fa-circle-user"></i>
                    <span>{fullName}</span>
                    <i className="fa-solid fa-angle-down"></i>
                </button>

                {profileOpen && (
                    <div className="dropdown show">
                        <Link to="/profile">
                            <i className="fa-solid fa-user"></i>
                            My Profile
                        </Link>

                        <Link to="/change-password">
                            <i className="fa-solid fa-key"></i>
                            Change Password
                        </Link>

                        <Link to="/settings">
                            <i className="fa-solid fa-gear"></i>
                            Settings
                        </Link>

                        <hr />

                        <a href="/login" onClick={handleLogout}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </a>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;