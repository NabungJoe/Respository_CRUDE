import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'

export default function Login(){
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/signin', { email, password });
      if (res.data?.data?.verified) {
        nav('/dashboard');
      } else {
        nav('/verify', { state: { email } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg.toLowerCase().includes('verify')) {
        nav('/verify', { state: { email } });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Student Login</h2>
      <p className="form-subtitle">Use your school email to sign in.</p>

      <form onSubmit={handleSubmit} className="form-fields">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input" placeholder="you@school.edu" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input" placeholder="••••••••" />
        </div>

        {error && <div className="form-message error">{error}</div>}

        <div className="form-actions form-actions-between">
          <button className="form-button" disabled={loading}>{loading? 'Signing...' : 'Sign in'}</button>
          <a href="/signup" className="form-link">Create account</a>
        </div>
      </form>

      <div className="form-note">By signing in you agree to the school's acceptable use policy.</div>
    </div>
  )
}