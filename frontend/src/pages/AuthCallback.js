import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // ถ้ามี token ใน URL ให้เก็บลง localStorage
      localStorage.setItem('token', `Bearer ${token}`);
      navigate('/dashboard'); // แล้วไปที่หน้า Dashboard
    } else {
      // ถ้าไม่มี ให้กลับไปหน้า Login
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
}

export default AuthCallback;