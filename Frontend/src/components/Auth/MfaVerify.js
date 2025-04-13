import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const MfaVerify = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/mfa/verify-login', { code });
      const token = sessionStorage.getItem('mfaToken');
      sessionStorage.setItem('token', token);
      sessionStorage.removeItem('mfaToken');
      toast.success('MFA verified!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid code');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verify MFA</h2>
        <input
          type="text"
          placeholder="Enter MFA code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="primary" type="submit">Verify</button>
      </form>
    </div>
  );
};

export default MfaVerify;