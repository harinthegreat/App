import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/group.css';

const CreateGroup = ({ onGroupCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [joiningPreference, setJoiningPreference] = useState('Public');
  const [isMuted, setIsMuted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/groups', { name, description, joiningPreference, isMuted });
      toast.success('Group created!');
      setName('');
      setDescription('');
      setIsMuted(false);
      onGroupCreated();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create group');
    }
  };

  return (
    <div className="card fade-in">
      <h3>Create Group</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={joiningPreference} onChange={(e) => setJoiningPreference(e.target.value)}>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
          <option value="InviteOnly">Invite Only</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={isMuted}
            onChange={(e) => setIsMuted(e.target.checked)}
          />
          Mute Notifications
        </label>
        <button className="primary" type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateGroup;