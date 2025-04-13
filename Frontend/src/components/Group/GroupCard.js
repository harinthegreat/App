import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/group.css';

const GroupCard = ({ groupName }) => {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    api.get(`/groups/${groupName}`)
      .then(res => setGroup(res.data))
      .catch(err => toast.error(err.response?.data?.error || 'Failed to load group'));
  }, [groupName]);

  const handleJoin = async () => {
    try {
      await api.post(`/groups/${groupName}/join`);
      toast.success('Joined group!');
      setGroup({ ...group, isMember: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Join failed');
    }
  };

  if (!group) return <p>Loading...</p>;

  return (
    <div className="card group-card fade-in">
      <h3>{group.name}</h3>
      <p>{group.description}</p>
      <p>Created by: {group.creatorUsername}</p>
      <p>Joining: {group.joiningPreference}</p>
      <p>{group.isMuted ? 'Muted' : 'Not Muted'}</p>
      {!group.isMember && (
        <button className="primary" onClick={handleJoin}>Join</button>
      )}
    </div>
  );
};

export default GroupCard;