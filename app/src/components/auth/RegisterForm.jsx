/* eslint-disable no-unused-vars */
// src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { register } from '../../services/authService';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateInput = () => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setError('Le pseudo ne doit contenir que des lettres, des chiffres et des underscores.');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateInput()) return;

    try {
      await register(username, password);
      // Rediriger vers la page d'accueil
      window.location.href = '/';
    } catch (error) {
      setError('Erreur lors de l\'inscription.');
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Pseudo" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default RegisterForm;
