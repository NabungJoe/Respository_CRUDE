import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Signup(){
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)


  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await api.post('/auth/signup', { email, password });
      setMessage('Account created! Please check your email for a verification code.');
      setTimeout(() => nav('/verify', { state: { email } }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  console.log(import.meta.env.VITE_API_URL)

  return (
    <div className="form-container">
      <h2 className="form-title">Create an account</h2>
      <form onSubmit={submit} className="form-fields">
        <div className="form-group">
          <label className="form-label">School Email</label>
          <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input" placeholder="student@school.edu" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input required minLength={6} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input" placeholder="Create a password" />
        </div>

        {message && <div className="form-message success">{message}</div>}
        {error && <div className="form-message error">{error}</div>}

        <div className="form-actions">
          <button className="form-button" disabled={loading}>{loading? 'Creating...' : 'Sign up'}</button>
        </div>
      </form>
    </div>
  )
}