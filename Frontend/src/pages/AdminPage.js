import React from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import '../styles/global.css';

const AdminPage = () => {
  return (
    <div className="container fade-in">
      <h2 style={{ color: '#4A90E2' }}>Admin Dashboard</h2>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;