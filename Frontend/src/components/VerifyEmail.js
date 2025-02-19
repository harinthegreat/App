import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { verifyEmail } from "../services/api";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();

  // Extract token from the URL query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    console.log("Token from URL:", token); // For debugging
    if (token) {
      verifyEmail(token)
        .then((res) => {
          console.log("Backend response:", res); // For debugging
          setMessage("Email verified successfully! You may now login.");
        })
        .catch((err) => {
          console.error("Verification error:", err); // For debugging
          setMessage("Invalid or expired token.");
        });
    } else {
      setMessage("No token found in URL.");
    }
  }, [token]);

  return (
    <div className="card mx-auto" style={{ maxWidth: "500px" }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Email Verification</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
