import React, {useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api.js'

export default function Verify(){
  const loc = useLocation()
  const nav = useNavigate()
  const initialEmail = loc.state?.email || ''
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const sendCode = async () =>{
    setError(null); setMessage(null)
    try{
  const res = await api.patch('/auth/send-verification-code', { email })
      setMessage(res.data?.message || 'Code sent')
    }catch(err){
      setError(err.response?.data?.message || err.message)
    }
  }

  const submit = async (e) =>{
    e.preventDefault()
    setLoading(true); setError(null); setMessage(null)
    try{
  const res = await api.patch('/auth/verifyCode', { email, providedCode: code })
      setMessage(res.data?.message || 'Verified')
      nav('/')
    }catch(err){
      setError(err.response?.data?.message || err.message)
    }finally{ setLoading(false) }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Verify your account</h2>
      <p className="form-subtitle">We sent a verification code to your school email. If you didn't receive it, you can resend.</p>

      <form onSubmit={submit} className="form-fields">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Verification Code</label>
          <input required type="text" value={code} onChange={(e)=>setCode(e.target.value)} className="form-input" placeholder="6-digit code" />
        </div>

        {message && <div className="form-message success">{message}</div>}
        {error && <div className="form-message error">{error}</div>}

        <div className="form-actions form-actions-between">
          <button type="button" onClick={sendCode} className="form-button" style={{background:'#eab308'}} disabled={loading}>Resend code</button>
          <button className="form-button" disabled={loading}>{loading? 'Verifying...' : 'Verify'}</button>
        </div>
      </form>
    </div>
  )
}