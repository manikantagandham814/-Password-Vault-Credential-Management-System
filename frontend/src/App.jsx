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
// LOGIN HISTORY
// =====================================================

import LoginHistory from "./pages/LoginHistory";


// =====================================================
// SECURITY
// =====================================================

import Security from "./pages/Security";


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

                <Route
                    path="/inbox"
                    element={<Inbox />}
                />

                <Route
                    path="/sent"
                    element={<Sent />}
                />

                <Route
                    path="/share-password/:id"
                    element={<SharePassword />}
                />

                <Route
                    path="/shared-password/:shareId"
                    element={<SharedPassword />}
                />


                {/* =================================================
                    LOGIN HISTORY
                ================================================= */}

                <Route
                    path="/login-history"
                    element={<LoginHistory />}
                />


                {/* =================================================
                    SECURITY
                ================================================= */}

                <Route
                    path="/security"
                    element={<Security />}
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