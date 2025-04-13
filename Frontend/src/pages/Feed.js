import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import CreatePost from '../components/Post/CreatePost';
import PostCard from '../components/Post/PostCard';
import SearchBar from '../components/Search/SearchBar';
import Notification from '../components/Notification/Notification';
import '../styles/global.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts/feed');
      setPosts(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load feed');
    }
  };

  useEffect(() => {
    fetchPosts();
    // Test admin-only endpoint
    if (user?.role === 'Admin') {
      api.get('/auth/admin-only')
        .then(res => console.log(res.data))
        .catch(err => console.log('Admin-only endpoint failed'));
    }
  }, [user]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(p => p.postId !== postId));
  };

  return (
    <div className="container fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#4A90E2' }}>Feed</h2>
        <div>
          <a href="/profile/me" style={{ marginRight: '10px' }}>Profile</a>
          {user?.role === 'Admin' && <a href="/admin" style={{ marginRight: '10px' }}>Admin</a>}
          <button className="danger" onClick={logout}>Logout</button>
        </div>
      </header>
      <Notification userId={user?.token} />
      <SearchBar />
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.map(post => (
        <PostCard key={post.postId} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default Feed;