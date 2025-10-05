
import { Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Verify from './components/Verify.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white text-gray-900">
      <header className="max-w-4xl mx-auto p-6 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">School Portal</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Login</Link>
          <Link to="/signup" className="hover:underline">Sign up</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <footer className="text-center p-6 text-sm text-gray-500">
      </footer>
    </div>
  )
}
