import React, { useState } from "react";
import { enableMfa, verifyMfaSetup } from "../services/api";

const EnableMFA = () => {
  const [mfaData, setMfaData] = useState(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleEnable = async () => {
    try {
      const data = await enableMfa();
      console.log("MFA Data from backend:", data); 
      setMfaData(data);
    } catch (err) {
      setMessage(err.error || "Error enabling MFA");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyMfaSetup({ code });
      setMessage("MFA enabled successfully!");
    } catch (err) {
      setMessage(err.error || "MFA verification failed");
    }
  };

  // If we have an otpauth URI, build the QR code URL using api.qrserver.com
  const getQrImageUrl = () => {
    if (!mfaData || !mfaData.QrCodeUri) return "";
    const baseUrl = "https://api.qrserver.com/v1/create-qr-code/";
    const encodedUri = encodeURIComponent(mfaData.QrCodeUri);
    const qrUrl = `${baseUrl}?data=${encodedUri}&size=200x200`;
    console.log("QR Image URL:", qrUrl); // For debugging
    return qrUrl;
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: "600px" }}>
      <div className="card-body">
        <h3 className="card-title">Enable MFA</h3>
        {message && <div className="alert alert-info">{message}</div>}

        {!mfaData ? (
          <button className="btn btn-primary w-100" onClick={handleEnable}>
            Enable MFA
          </button>
        ) : (
          <div>
            <p>
              <strong>Secret Key:</strong> {mfaData.SecretKey}
            </p>
            <p>Scan the QR Code with your authenticator app:</p>

            {mfaData.QrCodeUri ? (
              <img
                src={getQrImageUrl()}
                alt="MFA QR Code"
                onError={() => setMessage("Failed to load QR code image.")}
              />
            ) : (
              <p>No QrCodeUri available from backend.</p>
            )}

            <form onSubmit={handleVerify} className="mt-3">
              <div className="mb-3">
                <label className="form-label">Enter Code from Authenticator</label>
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Verify MFA
              </button>
            </form>

            {mfaData.RecoveryCodes && (
              <div className="mt-3">
                <h5>Recovery Codes</h5>
                <ul>
                  {mfaData.RecoveryCodes.map((rc, idx) => (
                    <li key={idx}>{rc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnableMFA;
