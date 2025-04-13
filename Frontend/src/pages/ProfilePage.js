import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import ProfileCard from '../components/Profile/ProfileCard';
import FollowRequests from '../components/Profile/FollowRequests';
import PostCard from '../components/Post/PostCard';
import '../styles/global.css';

const ProfilePage = () => {
  const { username } = useParams();
  const isOwnProfile = username === 'me';
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get(`/posts/user/${username}`)
      .then(res => setPosts(res.data))
      .catch(err => toast.error(err.response?.data?.error || 'Failed to load posts'));
  }, [username]);

  const handleDelete = (postId) => {
    setPosts(posts.filter(p => p.postId !== postId));
  };

  return (
    <div className="container fade-in">
      <ProfileCard username={username} isOwnProfile={isOwnProfile} />
      {isOwnProfile && <FollowRequests />}
      <h3 style={{ color: '#4A90E2' }}>Posts</h3>
      {posts.map(post => (
        <PostCard key={post.postId} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default ProfilePage;