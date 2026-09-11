import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                <i className="fa-solid fa-chart-line"></i>
                <span>Overview</span>
            </NavLink>

            <NavLink
                to="/passwords"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                <i className="fa-solid fa-key"></i>
                <span>My Passwords</span>
            </NavLink>

            <NavLink
                to="/add-password"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                <i className="fa-solid fa-plus"></i>
                <span>Add Password</span>
            </NavLink>

            <NavLink
                to="/inbox"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                <i className="fa-solid fa-inbox"></i>
                <span>Inbox</span>
            </NavLink>

            <NavLink
                to="/sent"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                <i className="fa-solid fa-paper-plane"></i>
                <span>Sent</span>
            </NavLink>

            <NavLink
                to="/login-history"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>Login History</span>
            </NavLink>

            <NavLink
                to="/security"
                className={({ isActive }) =>
                    isActive ? "active" : ""
                }
            >
                <i className="fa-solid fa-shield-halved"></i>
                <span>Security</span>
            </NavLink>
        </aside>
    );
}

export default Sidebar;