import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


// =====================================================
// AUTHENTICATION
// =====================================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";


// =====================================================
// DASHBOARD
// =====================================================

import Dashboard from "./pages/Dashboard";


// =====================================================
// PASSWORDS
// =====================================================

import Passwords from "./pages/Passwords";
import AddPassword from "./pages/AddPassword";
import ViewPassword from "./pages/ViewPassword";
import EditPassword from "./pages/EditPassword";


// =====================================================
// SHARING
// =====================================================

import Inbox from "./pages/Inbox";
import Sent from "./pages/Sent";
import SharePassword from "./pages/SharePassword";
import SharedPassword from "./pages/SharedPassword";


// =====================================================
// PROFILE
// =====================================================

import EditProfile from "./pages/EditProfile";


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =================================================
                    HOME
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* =================================================
                    AUTHENTICATION
                ================================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOtp />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* =================================================
                    PASSWORDS
                ================================================= */}

                <Route
                    path="/passwords"
                    element={<Passwords />}
                />

                <Route
                    path="/add-password"
                    element={<AddPassword />}
                />

                <Route
                    path="/view-password/:id"
                    element={<ViewPassword />}
                />

                <Route
                    path="/edit-password/:id"
                    element={<EditPassword />}
                />


                {/* =================================================
                    SHARING
                ================================================= */}

                {/* Passwords shared with the logged-in user */}

                <Route
                    path="/inbox"
                    element={<Inbox />}
                />


                {/* Passwords shared by the logged-in user */}

                <Route
                    path="/sent"
                    element={<Sent />}
                />


                {/* Share a password */}

                <Route
                    path="/share-password/:id"
                    element={<SharePassword />}
                />


                {/* View a shared password */}

                <Route
                    path="/shared-password/:shareId"
                    element={<SharedPassword />}
                />


                {/* =================================================
                    PROFILE
                ================================================= */}

                <Route
                    path="/profile"
                    element={<EditProfile />}
                />


            </Routes>

        </BrowserRouter>
    );
}


export default App;