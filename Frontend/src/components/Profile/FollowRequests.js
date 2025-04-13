import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/profile.css';

const FollowRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get('/auth/follow/requests')
      .then(res => setRequests(res.data))
      .catch(err => toast.error('Failed to load requests'));
  }, []);

  const handleRespond = async (targetUsername, accept) => {
    try {
      await api.post('/auth/follow/respond', { targetUsername, accept });
      toast.success(accept ? 'Request accepted!' : 'Request rejected!');
      setRequests(requests.filter(r => r.requesterUsername !== targetUsername));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Response failed');
    }
  };

  return (
    <div className="card follow-requests fade-in">
      <h3>Follow Requests</h3>
      {requests.length === 0 && <p>No pending requests</p>}
      {requests.map(req => (
        <div key={req.requesterUsername}>
          <span>{req.requesterUsername}</span>
          <button className="primary" onClick={() => handleRespond(req.requesterUsername, true)}>Accept</button>
          <button className="danger" onClick={() => handleRespond(req.requesterUsername, false)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default FollowRequests;