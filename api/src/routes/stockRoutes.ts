import express, { Request, Response } from 'express';
import User from '../models/User';
import Pastry from '../models/Pastry';

const router = express.Router();

// Route pour vérifier si la somme des stocks des pâtisseries est égale à 0
router.get('/check-stock', async (req: Request, res: Response) => {
    try {
      const pastries = await Pastry.find();
      const totalStock = pastries.reduce((sum, pastry) => sum + pastry.stock, 0);
  
      // Retourner si le stock est épuisé ou non
      res.json({ isOutOfStock: totalStock === 0 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Route pour retourner les utilisateurs avec leur pseudo et leurs pâtisseries gagnées
  router.get('/users-with-pastries', async (req: Request, res: Response) => {
    try {
      // Récupérer les utilisateurs ayant gagné des pâtisseries
      const users = await User.find({ 'gameData.pastryWon': { $exists: true, $not: { $size: 0 } } }, 'username gameData.pastryWon').exec();
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  export default router;