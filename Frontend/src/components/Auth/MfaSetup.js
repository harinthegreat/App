import React, { useState, useEffect } from 'react';
import {QRCodeCanvas} from 'qrcode.react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const MfaSetup = () => {
  const [secret, setSecret] = useState('');
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.post('/auth/mfa/enable')
      .then(res => {
        setSecret(res.data.secretKey);
        setQrCodeUri(res.data.qrCodeUri);
      })
      .catch(err => toast.error('Failed to enable MFA'));
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/mfa/verify-setup', { code });
      toast.success('MFA enabled!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid code');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Setup MFA</h2>
        {qrCodeUri && (
          <div className="qr-code">
            <QRCodeCanvas value={qrCodeUri} size={200} />
            <p>Scan this with your authenticator app</p>
          </div>
        )}
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter MFA code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="primary" type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default MfaSetup;