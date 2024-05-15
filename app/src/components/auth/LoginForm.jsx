/* eslint-disable no-unused-vars */
// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { login } from '../../services/authService';

const LoginForm = () => {
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
      const token = await login(username, password);
      // Stocker le token dans le local storage et rediriger vers la page d'accueil
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (error) {
      setError('Erreur lors de la connexion.');
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Pseudo" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;
