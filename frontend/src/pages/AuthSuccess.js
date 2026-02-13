import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          login(res.data, token);
          navigate('/');
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Logging you in...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;