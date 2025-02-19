import React, { useState } from "react";
import { verifyMfaLogin } from "../services/api";
import { useNavigate } from "react-router-dom";

const MfaVerifyLogin = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mfaToken = localStorage.getItem("mfaToken");
    try {
      await verifyMfaLogin({ code, token: mfaToken });
      localStorage.setItem("token", mfaToken);
      navigate("/profile");
    } catch (err) {
      setMessage(err.error || "MFA verification failed.");
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: "500px" }}>
      <div className="card-body">
        <h3 className="card-title mb-4">MFA Verification</h3>
        {message && <div className="alert alert-danger">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Enter MFA Code</label>
            <input
              type="text"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Verify MFA
          </button>
        </form>
      </div>
    </div>
  );
};

export default MfaVerifyLogin;
