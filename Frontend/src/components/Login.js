import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import "C:\\Users\\aryan\\OneDrive\\Desktop\\Dotnet_Final_Social_Project\\App\\social-media-frontend\\src\\Styles\\Auth.css"; // Import the new CSS file

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      localStorage.setItem("token", data.token);
      navigate("/profile");
    } catch (err) {
      setMessage(err.error || "Login failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {message && <div className="alert alert-danger">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="switch-form">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
