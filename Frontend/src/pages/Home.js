import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/global.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  if (user) return <Navigate to="/feed" />;

  return (
    <div className="container fade-in">
      <h1 style={{ color: '#4A90E2', textAlign: 'center', marginTop: '50px' }}>
        Welcome to Our Social Media App!
      </h1>
      <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
        Connect with friends, share posts, and join groups.
      </p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="/login">
          <button className="primary">Login</button>
        </a>
        <a href="/register" style={{ marginLeft: '10px' }}>
          <button className="primary">Register</button>
        </a>
      </div>
    </div>
  );
};

export default Home;