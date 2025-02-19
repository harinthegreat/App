import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import EnableMFA from "./components/EnableMFA";
import MfaVerifyLogin from "./components/MfaVerifyLogin";
import AdminPage from "./components/AdminPage";
import VerifyEmail from './components/VerifyEmail';

function App() {
  // Check if a token exists in localStorage to determine authentication
  const isAuthenticated = () => !!localStorage.getItem("token");

  // Check if user is an admin (this value should be set after login)
  const isAdmin = () => localStorage.getItem("role") === "Admin";

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/enable-mfa" element={isAuthenticated() ? <EnableMFA /> : <Navigate to="/login" />} />
          <Route path="/mfa-verify-login" element={<MfaVerifyLogin />} />
          <Route path="/admin" element={isAuthenticated() && isAdmin() ? <AdminPage /> : <Navigate to="/login" />} />
          <Route
            path="/profile"
            element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/enable-mfa"
            element={isAuthenticated() ? <EnableMFA /> : <Navigate to="/login" />}
          />
          <Route path="/mfa-verify-login" element={<MfaVerifyLogin />} />
          <Route
            path="/admin"
            element={isAuthenticated() && isAdmin() ? <AdminPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
