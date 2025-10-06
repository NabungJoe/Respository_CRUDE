import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, children }) {
  const location = useLocation();
  if (!user || !user._id) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if (!user.verified) {
    return <Navigate to="/verify" replace state={{ email: user.email }} />;
  }
  return children;
}
