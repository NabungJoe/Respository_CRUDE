
import React, { useEffect, useState } from 'react';
import api from '../services/api';
// import BrainDemo from '../brainModel';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Fetch user and posts
  useEffect(() => {
    (async () => {
      try {
        const userRes = await api.get('/auth/getSignedInUser');
        setUser(userRes.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
      try {
  const postsRes = await api.get('/posts');
  setPosts(postsRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
      setLoading(false);
    })();
  }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update post
  const handleSubmit = async e => {
    e.preventDefault();
    setActionError(null);
    try {
      if (editingId) {
        const res = await api.put(`/posts/${editingId}`, form);
        setPosts(posts => posts.map(p => p._id === editingId ? res.data.data : p));
        setEditingId(null);
      } else {
  const res = await api.post('/posts', { ...form, userId: user?._id });
  setPosts([res.data.data, ...posts]);
      }
      setForm({ title: '', description: '' });
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    }
  };

  // Edit post
  const handleEdit = post => {
    setEditingId(post._id);
    setForm({ title: post.title, description: post.description });
  };

  // Delete post
  const handleDelete = async id => {
    setActionError(null);
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts => posts.filter(p => p._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      {error && <div className="form-message error">{error}</div>}
      <div className="dashboard-welcome">
        <h3 className="dashboard-username">Welcome{user ? `, ${user.email}` : ''}</h3>
        <p className="dashboard-desc">This is your personalized student dashboard.</p>
      </div>

      <section className="dashboard-section">
        <h4 className="dashboard-section-title">Social Feed</h4>
        <form onSubmit={handleSubmit} className="post-form" style={{ marginBottom: 20 }}>
          <input
            className="form-input"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ marginBottom: 8 }}
          />
          <textarea
            className="form-input"
            name="description"
            placeholder="What's on your mind?"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            style={{ marginBottom: 8 }}
          />
          <div className="form-actions">
            {editingId && (
              <button type="button" className="form-button" onClick={() => { setEditingId(null); setForm({ title: '', description: '' }); }}>Cancel</button>
            )}
            <button type="submit" className="form-button">
              {editingId ? 'Update' : 'Post'}
            </button>
          </div>
          {actionError && <div className="form-message error">{actionError}</div>}
        </form>
        {loading ? (
          <div>Loading feed...</div>
        ) : (
          <div className="feed-list">
            {posts.length === 0 && <div>No posts yet.</div>}
            {posts.map(post => (
              <div key={post._id} className="feed-post" style={{ background: '#f9fafb', borderRadius: 8, padding: 14, marginBottom: 12, boxShadow: '0 1px 4px #e5e7eb' }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{post.title}</div>
                <div style={{ margin: '6px 0 10px 0', color: '#334155' }}>{post.description}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  Posted {new Date(post.createdAt).toLocaleString()} by {post.userId?.email || 'Unknown'}
                </div>
                {user && post.userId && post.userId._id === user._id && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button className="form-button" style={{ padding: '4px 12px', fontSize: 13 }} onClick={() => handleEdit(post)}>Edit</button>
                    <button className="form-button" style={{ padding: '4px 12px', fontSize: 13, background: '#ef4444' }} onClick={() => handleDelete(post._id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>



      <div className="dashboard-actions">
        <button
          onClick={async () => {
            await api.post('/auth/signout');
            window.location.href = '/';
          }}
          className="dashboard-signout"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}