import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const userRes = await api.get(`/auth/search/users?query=${query}`);
      setUsers(userRes.data);
      const postRes = await api.get(`/posts/search?username=${query}`);
      setPosts(postRes.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Search failed');
    }
  };

  return (
    <div className="card fade-in">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search users or posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="primary" type="submit">Search</button>
      </form>
      {users.length > 0 && (
        <div>
          <h4>Users</h4>
          {users.map(u => (
            <p key={u.username} onClick={() => navigate(`/profile/${u.username}`)} style={{ cursor: 'pointer' }}>
              {u.username}
            </p>
          ))}
        </div>
      )}
      {posts.length > 0 && (
        <div>
          <h4>Posts</h4>
          {posts.map(p => (
            <div key={p.postId}>
              <p>{p.username}: {p.content}</p>
              {p.mediaUrls && <img src={p.mediaUrls} alt="Post" style={{ maxWidth: '100px' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;