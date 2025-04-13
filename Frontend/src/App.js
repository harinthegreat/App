import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Feed from './pages/Feed';
import ProfilePage from './pages/ProfilePage';
import GroupPage from './pages/GroupPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MfaSetup from './components/Auth/MfaSetup';
import MfaVerify from './components/Auth/MfaVerify';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/feed" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/feed" />} />
        <Route path="/mfa/setup" element={user ? <MfaSetup /> : <Navigate to="/login" />} />
        <Route path="/mfa/verify" element={<MfaVerify />} />
        <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/group/:groupName" element={user ? <GroupPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && user.role === 'Admin' ? <AdminPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;