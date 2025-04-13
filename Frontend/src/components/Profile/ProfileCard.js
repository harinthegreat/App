import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/profile.css';

const ProfileCard = ({ username, isOwnProfile }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const endpoint = isOwnProfile ? '/auth/profile' : `/auth/profile/${username}`;
    api.get(endpoint)
      .then(res => setProfile(res.data))
      .catch(err => toast.error(err.response?.data?.error || 'Failed to load profile'));
  }, [username, isOwnProfile]);

  const handleFollow = async () => {
    try {
      await api.post('/auth/follow', { targetUsername: username });
      toast.success('Follow request sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Follow failed');
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="card profile-card fade-in">
      <h3>{profile.username}</h3>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
      <p>{profile.isPrivate ? 'Private Profile' : 'Public Profile'}</p>
      {!isOwnProfile && (
        <button className="primary" onClick={handleFollow}>Follow</button>
      )}
    </div>
  );
};

export default ProfileCard;