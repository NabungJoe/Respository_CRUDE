

import { Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Verify from './components/Verify.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import api from './services/api';


export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const userRes = await api.get('/auth/getSignedInUser');
        setUser(userRes.data?.data || null);
      } catch {
        setUser(null);
      }
    })();
  }, []);

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
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
q
      <footer className="text-center p-6 text-sm text-gray-500">
      </footer>
    </div>
  );
}
