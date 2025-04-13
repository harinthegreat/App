import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../../styles/post.css';

const CreatePost = ({ groupId, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [postType, setPostType] = useState('Text');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('postType', postType);
    formData.append('isPrivate', isPrivate);
    if (groupId) formData.append('groupId', groupId);
    if (file) formData.append('mediaUrls', file);

    try {
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Post created!');
      setContent('');
      setFile(null);
      setIsPrivate(false);
      onPostCreated();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create post');
    }
  };

  return (
    <div className="card create-post fade-in">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <select value={postType} onChange={(e) => setPostType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="Poll">Poll</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private Post
        </label>
        <button className="primary" type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;