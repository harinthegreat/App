import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/post.css';

const PostCard = ({ post, onDelete }) => {
  const [interactions, setInteractions] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    api.get(`/posts/${post.postId}/interactions`)
      .then(res => setInteractions(res.data))
      .catch(err => toast.error('Failed to load interactions'));
  }, [post.postId]);

  const handleInteraction = async (type, text = null) => {
    try {
      await api.post(`/posts/${post.postId}/interact`, {
        interactionType: type,
        commentText: text,
        emoji: type === 'Emoji' ? '😊' : null
      });
      toast.success(`${type} added!`);
      const res = await api.get(`/posts/${post.postId}/interactions`);
      setInteractions(res.data);
      setCommentText('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Interaction failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post.postId}`);
      toast.success('Post deleted!');
      onDelete(post.postId);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="card post-card fade-in">
      <h4>{post.username}</h4>
      <p className="content">{post.content}</p>
      {post.mediaUrls && <img src={post.mediaUrls} alt="Post" />}
      <p>{new Date(post.createdAt).toLocaleString()}</p>
      <div className="interactions">
        <button onClick={() => handleInteraction('Like')}>Like</button>
        <button onClick={() => handleInteraction('Emoji')}>😊</button>
        <input
          type="text"
          placeholder="Add a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={() => handleInteraction('Comment', commentText)}>Comment</button>
        <button className="danger" onClick={handleDelete}>Delete</button>
      </div>
      <div>
        {interactions.map(i => (
          <p key={i.interactionId}>{i.username}: {i.commentText || i.emoji || i.interactionType}</p>
        ))}
      </div>
    </div>
  );
};

export default PostCard;