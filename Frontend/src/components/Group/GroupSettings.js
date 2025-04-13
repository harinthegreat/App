import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/group.css';

const GroupSettings = ({ groupName }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [joiningPreference, setJoiningPreference] = useState('Public');
  const [isMuted, setIsMuted] = useState(false);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/groups/${groupName}`)
      .then(res => {
        setName(res.data.name);
        setDescription(res.data.description);
        setJoiningPreference(res.data.joiningPreference);
        setIsMuted(res.data.isMuted);
        // Mock members list (since no endpoint for members)
        setMembers([{ username: 'member1', role: 'Member' }, { username: 'member2', role: 'Member' }]);
      })
      .catch(err => toast.error('Failed to load group'));
  }, [groupName]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/groups/${groupName}/settings`, { name, description, joiningPreference, isMuted });
      toast.success('Group updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  const handlePromote = async (memberUsername) => {
    try {
      await api.post(`/groups/${groupName}/promote/${memberUsername}`);
      toast.success(`${memberUsername} promoted!`);
      setMembers(members.map(m => m.username === memberUsername ? { ...m, role: 'Admin' } : m));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Promote failed');
    }
  };

  const handleRemove = async (memberUsername) => {
    try {
      await api.post(`/groups/${groupName}/remove/${memberUsername}`);
      toast.success(`${memberUsername} removed!`);
      setMembers(members.filter(m => m.username !== memberUsername));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Remove failed');
    }
  };

  const handleBan = async (memberUsername) => {
    try {
      await api.post(`/groups/${groupName}/ban/${memberUsername}`);
      toast.success(`${memberUsername} banned!`);
      setMembers(members.filter(m => m.username !== memberUsername));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ban failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/groups/${groupName}`);
      toast.success('Group deleted!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="card group-settings fade-in">
      <h3>Group Settings</h3>
      <form onSubmit={handleUpdate}>
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
        <button className="primary" type="submit">Update</button>
      </form>
      <h4>Members</h4>
      {members.map(m => (
        <div key={m.username}>
          <span>{m.username} ({m.role})</span>
          {m.role !== 'Admin' && (
            <>
              <button className="primary" onClick={() => handlePromote(m.username)}>Promote</button>
              <button className="danger" onClick={() => handleRemove(m.username)}>Remove</button>
              <button className="danger" onClick={() => handleBan(m.username)}>Ban</button>
            </>
          )}
        </div>
      ))}
      <button className="danger" onClick={handleDelete}>Delete Group</button>
    </div>
  );
};

export default GroupSettings;