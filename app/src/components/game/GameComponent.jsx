import './GameComponent.css';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import gsap from 'gsap';

const GameComponent = ({ token }) => {
  const [attempts, setAttempts] = useState(0);
  const [pastry, setPastry] = useState(false);
  const [dices, setDices] = useState([0, 0, 0, 0, 0]);
  const [pastries, setPastries] = useState([]);
  const animationDuration = useRef(0); // Ref to store the animation duration
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    // Fonction pour récupérer les informations de l'utilisateur
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const attempts = response.data.attempts;
        const pastryWon = response.data.pastryWon;
        setAttempts(attempts);
        // Si l'utilisateur a gagné des pâtisseries, les afficher
        if (pastryWon && pastryWon.length) {
          setPastry(true);
          setPastries(pastryWon);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserInfo();
  }, [token]);

  const launch = async () => {
    try {
      const response = await axios.post(`${API_URL}/game`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDices(response.data.dices);
      setAttempts(response.data.attemptsRemaining);

      if (response.data.pastriesWon && response.data.pastriesWon.length) {
        // Delay the pastry state update until the animation is finished
        setTimeout(() => {
          setPastry(true);
          setPastries(response.data.pastriesWon);
        }, animationDuration.current);
      }
    } catch (error) {
      console.error('Error rolling dice:', error.message);
    }
  };

  return (
    <div>
      {/* Afficher les dés */}
      {dices.map((dice, index) => (
        <Dice key={index} value={dice} animationDuration={animationDuration} />
      ))}
      {/* Afficher le bouton pour lancer les dés */}
      <div className="actions">
        {attempts === 0 || pastry ? (
          <button disabled>Vous ne pouvez plus jouer.</button>
        ) : (
          <button onClick={launch}>JOUER [{attempts}]</button>
        )}
      </div>

      {/* Afficher les pâtisseries gagnées si l'utilisateur a gagné */}
      {pastry && <p className="congratulations">Félicitations! Vous avez gagné !</p>}
      {pastries.length > 0 && (
        <div>
          <h2 className="pastries-title">Vos gâteaux gagnés</h2>
          <div className="pastries-container">
            {pastries.map((pastry, index) => (
              <div key={index} className="pastry-card">
                <img src={`/src/assets/images/${pastry.image}`} alt={pastry.name} className="pastry-image" />
                <p className="pastry-name">{pastry.name}</p>
                <p className="pastry-date">Gagné le {new Date(pastry.wonAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour afficher un dé
const Dice = ({ value, animationDuration }) => {
  const faces = [value, ...gsap.utils.shuffle([1, 2, 3, 4, 5, 6].filter((v) => v !== value))];
  const dice = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(dice.current, {
        rotationX: 'random(720, 1080)',
        rotationY: 'random(720, 1080)',
        rotationZ: 0,
        duration: 'random(2, 3)',
      });
      animationDuration.current = Math.max(animationDuration.current, tl.duration() * 1000); // Store the max duration
    }, dice);
    return () => ctx.revert();
  }, [value, animationDuration]);

  return (
    <div className="dice-container">
      <div className="dice" ref={dice}>
        {faces.map((val, idx) => (
          <div key={idx} className="face">
            {val}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameComponent;
