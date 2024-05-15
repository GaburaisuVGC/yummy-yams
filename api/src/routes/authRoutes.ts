// src/routes/authRoutes.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware de validation
const validateRegister = [
  body('username').isAlphanumeric().withMessage('Le pseudo ne doit contenir que des lettres et des chiffres.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
];

const validateLogin = [
  body('username').isAlphanumeric().withMessage('Le pseudo ne doit contenir que des lettres et des chiffres.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
];

// Route pour enregistrer un nouvel utilisateur
router.post('/register', validateRegister, async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    // Vérifier si le nom d'utilisateur ou le mot de passe est manquant
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Le pseudo est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = new User({ username, password: hashedPassword, gameData: { attemptsRemaining: 3, pastryWon: []}});
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error :' + error });
  }
});

// Route pour connecter un utilisateur
router.post('/login', validateLogin, async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Vérifier si le mot de passe est correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: ' + error });
  }
});

export default router;
