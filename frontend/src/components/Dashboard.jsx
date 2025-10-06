
import React, { useEffect, useState } from 'react';
import api from '../services/api';

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
    if (!user || !user._id) {
      setActionError('You must be signed in to create a post.');
      return;
    }
    try {
      if (editingId) {
        const res = await api.put(`/posts/${editingId}`, form);
        setPosts(posts => posts.map(p => p._id === editingId ? res.data.data : p));
        setEditingId(null);
      } else {
        const res = await api.post('/posts', { ...form });
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
      <header style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16}}>
        <h1 style={{fontSize: '2.6rem', fontWeight: 800, color: '#1e40af', letterSpacing: '-1px', margin: 0}}>Student Dashboard</h1>
        <div className="dashboard-welcome" style={{marginTop: 8}}>
          <h3 className="dashboard-username" style={{fontSize: '1.3rem', fontWeight: 700}}>
            {user ? (
              <>
                Welcome, <span style={{color: '#2563eb', fontWeight: 800}}>{user.email}</span>
              </>
            ) : (
              'Welcome!'
            )}
          </h3>
          <p className="dashboard-desc" style={{fontSize: '1.08rem'}}>{user ? 'This is your personalized student dashboard.' : 'Please sign in to access your dashboard.'}</p>
        </div>
      </header>

      <section className="dashboard-section" style={{boxShadow: '0 2px 16px 0 rgba(37,99,235,0.07)', background: '#f1f5fa'}}>
        <h2 className="dashboard-section-title" style={{fontSize: '1.25rem', color: '#2563eb', fontWeight: 700, marginBottom: 16, textAlign: 'center', letterSpacing: '-0.5px'}}>Social Feed</h2>
        <form onSubmit={handleSubmit} className="post-form" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            className="form-input"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ marginBottom: 6, fontWeight: 600, fontSize: '1.05rem' }}
          />
          <textarea
            className="form-input"
            name="description"
            placeholder="What's on your mind?"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            style={{ marginBottom: 6, fontSize: '1.01rem' }}
          />
          <div className="form-actions" style={{justifyContent: 'space-between'}}>
            {editingId && (
              <button type="button" className="form-button" style={{background: '#64748b'}} onClick={() => { setEditingId(null); setForm({ title: '', description: '' }); }}>Cancel</button>
            )}
            <button type="submit" className="form-button" style={{minWidth: 100}}>
              {editingId ? 'Update' : 'Post'}
            </button>
          </div>
          {actionError && <div className="form-message error">{actionError}</div>}
        </form>
        {loading ? (
          <div style={{textAlign: 'center', color: '#64748b'}}>Loading feed...</div>
        ) : (
          <div className="feed-list" style={{marginTop: 8}}>
            {posts.length === 0 && <div style={{textAlign: 'center', color: '#64748b'}}>No posts yet.</div>}
            {posts.map(post => (
              <div key={post._id} className="feed-post" style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 16, boxShadow: '0 1px 6px #e5e7eb', borderLeft: '4px solid #2563eb' }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#1e293b', marginBottom: 4 }}>{post.title}</div>
                <div style={{ margin: '6px 0 10px 0', color: '#334155', fontSize: 15 }}>{post.description}</div>
                <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 4 }}>
                  Posted {new Date(post.createdAt).toLocaleString()} by <span style={{color: '#2563eb', fontWeight: 600}}>{post.userId?.email || 'Unknown'}</span>
                </div>
                {user && post.userId && post.userId._id === user._id && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
                    <button className="form-button" style={{ padding: '4px 14px', fontSize: 13, background: '#fbbf24', color: '#1e293b' }} onClick={() => handleEdit(post)}>Edit</button>
                    <button className="form-button" style={{ padding: '4px 14px', fontSize: 13, background: '#ef4444' }} onClick={() => handleDelete(post._id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="dashboard-actions" style={{marginTop: 24}}>
        <button
          onClick={async () => {
            await api.post('/auth/signout');
            window.location.href = '/';
          }}
          className="dashboard-signout"
          style={{fontWeight: 700, fontSize: '1.08rem', padding: '12px 28px', borderRadius: 8, boxShadow: '0 1px 4px #e5e7eb'}}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}