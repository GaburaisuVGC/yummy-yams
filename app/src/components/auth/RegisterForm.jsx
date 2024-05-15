/* eslint-disable no-unused-vars */
// src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { register } from '../../services/authService';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      // Rediriger vers la page d'accueil
      window.location.href = '/';
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Pseudo" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default RegisterForm;
