/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import * as jose from 'jose';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import GameComponent from './components/game/GameComponent';
import './App.css';

const App = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [isOutOfStock, setIsOutOfStock] = useState(true);
  const [usersWithPastries, setUsersWithPastries] = useState([]);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    // Vérifie si un token est présent dans le local storage
    const token = localStorage.getItem('token');
    if (token) {
      // Si un token est présent, décoder le token pour obtenir l'username
      const decodedToken = jose.decodeJwt(token);
      setUsername(decodedToken.username);
      setToken(token);
    }

    // Vérifie si le stock des pâtisseries est épuisé
    const checkStock = async () => {
      const response = await axios.get(`${API_URL}/stock/check-stock`);
      const data = response.data;
      setIsOutOfStock(data.isOutOfStock);

      if (data.isOutOfStock) {
        // Récupère la liste des utilisateurs avec leurs pâtisseries gagnées
        const usersResponse = await axios.get(`${API_URL}/stock/users-with-pastries`);
        setUsersWithPastries(usersResponse.data);
      }

    // TEST : Simuler un stock épuisé
    // setIsOutOfStock(true);
    // const usersResponse = await axios.get(`${API_URL}/stock/users-with-pastries`);
    // setUsersWithPastries(usersResponse.data);
    };


    checkStock();
  }, []);

  const handleOpenRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false); // Fermer la popup de connexion si elle est ouverte
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false); // Fermer la popup d'inscription si elle est ouverte
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    // Supprimer le token du local storage et actualiser la page pour se déconnecter
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div style={{ minWidth: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <nav>
        <div className="logo">Yummy Yam's</div>
        <ul className="nav-links">
          {username && <li>Bienvenue, {username} !</li>}
          {!username && <li onClick={handleOpenRegisterModal}>S'inscrire</li>}
          {!username && <li onClick={handleOpenLoginModal}>Se connecter</li>}
          {username && <li onClick={handleLogout}>Déconnexion</li>}
        </ul>
      </nav>
      <h1 style={{ marginTop: "20px" }}>Yummy Yam's</h1>
      <p style={{ marginBottom: "20px", marginTop: "20px" }}>
        Bienvenue sur le site Yummy Yam's, où vous pouvez de gagner des pâtisseries en jouant à un jeu de dés.
      </p>

      {/* si le stock est épuisé, afficher la liste des gagnants */}
      {isOutOfStock ? (
        <div>
          <h2>Le jeu est terminé</h2>
          <h3>Voici les gagnants :</h3>
          <ul className="users-list">
            {usersWithPastries.map((user, index) => (
              <li key={index} className="user-item">
                <strong>{user.username} :</strong>
                <ul className="pastries-list">
                  {user.gameData.pastryWon.map((pastry, pIndex) => (
                    <li key={pIndex} className="pastry-item">
                      <img src={`/src/assets/images/${pastry.image}`} alt={pastry.name} className="pastry-image" />
                      <span>{pastry.name}</span>
                      <span>(gagné le {new Date(pastry.wonAt).toLocaleDateString()})</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Si l'utilisateur est connecté, afficher le jeu
        username ? (
          <GameComponent token={token} />
        ) : (
          // Si l'utilisateur n'est pas connecté, afficher le carousel
          <div style={{ width: '50%', margin: 'auto' }}>
            <Carousel
              showArrows={true}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
              style={{ marginTop: '20px', width: '50%', margin: 'auto' }}
            >
              <div>
                <img src="/src/assets/images/banana-split.jpeg" alt="Banana Split" />
              </div>
              <div>
                <img src="/src/assets/images/brioche-pain-perdu.jpeg" alt="Brioche Pain Perdu" />
              </div>
              <div>
                <img src="/src/assets/images/cake-choco.jpeg" alt="Cake Choco" />
              </div>
              <div>
                <img src="/src/assets/images/cake-framboise.jpeg" alt="Cake Framboise" />
              </div>
              <div>
                <img src="/src/assets/images/eclair.jpeg" alt="Éclair" />
              </div>
              <div>
                <img src="/src/assets/images/fondant.jpeg" alt="Fondant" />
              </div>
              <div>
                <img src="/src/assets/images/glaces-vanille.jpeg" alt="Glace Vanille" />
              </div>
              <div>
                <img src="/src/assets/images/tarte-poire.jpeg" alt="Tarte Poire" />
              </div>
            </Carousel>
          </div>
        )
      )}

      {/* Popup d'inscription */}
      {showRegisterModal && (
        <div className="modal" style={{ zIndex: "1000" }}>
          <div className="modal-content">
            <span className="close" onClick={handleCloseRegisterModal}>&times;</span>
            <RegisterPage />
          </div>
        </div>
      )}

      {/* Popup de connexion */}
      {showLoginModal && (
        <div className="modal" style={{ zIndex: "1000" }}>
          <div className="modal-content">
            <span className="close" onClick={handleCloseLoginModal}>&times;</span>
            <LoginPage />
          </div>
        </div>
      )}

      {/* Overlay pour flouter le reste de la page */}
      {(showRegisterModal || showLoginModal) && <div className="overlay" style={{ zIndex: "999" }}></div>}
    </div>
  );
};

export default App;
