// routes/user.js
import express from 'express';
const router = express.Router();
import User from '../models/User';
import authMiddleware from '../middleware/authMiddleware';

// Route pour récupérer les informations de l'utilisateur
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ attempts: user.gameData.attemptsRemaining, pastryWon: user.gameData.pastryWon, username: user.username});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;