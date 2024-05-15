/* eslint-disable no-unused-vars */
// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { login } from '../../services/authService';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(username, password);
      // Stocker le token dans le local storage et rediriger vers la page d'accueil
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
