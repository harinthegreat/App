import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import GroupCard from '../components/Group/GroupCard';
import GroupSettings from '../components/Group/GroupSettings';
import CreatePost from '../components/Post/CreatePost';
import PostCard from '../components/Post/PostCard';
import '../styles/global.css';

const GroupPage = () => {
  const { groupName } = useParams();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get(`/groups/${groupName}`)
      .then(res => {
        setGroup(res.data);
        api.get(`/posts/group/${res.data.groupId}`)
          .then(postRes => setPosts(postRes.data))
          .catch(err => toast.error(err.response?.data?.error || 'Failed to load posts'));
      })
      .catch(err => toast.error(err.response?.data?.error || 'Failed to load group'));
  }, [groupName]);

  const handlePostCreated = () => {
    api.get(`/posts/group/${group.groupId}`)
      .then(res => setPosts(res.data))
      .catch(err => toast.error('Failed to load posts'));
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(p => p.postId !== postId));
  };

  if (!group) return <p>Loading...</p>;

  return (
    <div className="container fade-in">
      <GroupCard groupName={groupName} />
      <GroupSettings groupName={groupName} />
      <CreatePost groupId={group.groupId} onPostCreated={handlePostCreated} />
      <h3 style={{ color: '#4A90E2' }}>Group Posts</h3>
      {posts.map(post => (
        <PostCard key={post.postId} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default GroupPage;