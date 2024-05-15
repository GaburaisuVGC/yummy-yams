import express, { Request, Response } from 'express';
import User, { UserDocument } from '../models/User';
import Pastry from '../models/Pastry';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, async (req: any, res) => {
  try {

    // Récupérer l'ID de l'utilisateur depuis la requête
    const userId = req.userId;
    const user: UserDocument | null = await User.findById(userId);

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Vérifier si l'utilisateur a encore des tentatives
    if (user.gameData.attemptsRemaining <= 0) {
      return res.status(400).json({ error: 'No attempts remaining' });
    }

    // Vérifier si l'utilisateur a déjà gagné
    if (user.gameData.pastryWon.length > 0) {
      return res.status(400).json({ error: 'User has already won' });
    }

    // Lancer les dés
    const dices = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    const diceCounts: { [key: number]: number } = dices.reduce((counts, dice) => {
      counts[dice] = (counts[dice] || 0) + 1;
      return counts;
    }, {} as { [key: number]: number });

    const counts = Object.values(diceCounts);

    // Vérifier si l'utilisateur a gagné des pâtisseries en fonction des dés
    let pastriesWon = 0;

    // Si l'utilisateur a obtenu 5 dés identiques, il gagne 3 pâtisseries (YAM'S)
    // Si l'utilisateur a obtenu 4 dés identiques, il gagne 2 pâtisseries (Carré)
    // Si l'utilisateur a obtenu 2 paires de dés identiques, il gagne 1 pâtisserie (Double paire)
    if (counts.includes(5)) {
      pastriesWon = 3;
    } else if (counts.includes(4)) {
      pastriesWon = 2;
    } else if (counts.filter(count => count >= 2).length >= 2) {
      pastriesWon = 1;
    }

    // Check le stock des pâtisseries
    const pastries = await Pastry.find();
    const totalStock = pastries.reduce((sum, pastry) => sum + pastry.stock, 0);

    // Si le stock est inférieur au nombre de pâtisseries à gagner, le nombre de pâtisseries gagnées prend la valeur du stock restant
    if (pastriesWon > totalStock) {
      pastriesWon = totalStock;
    }

    // Mettre à jour les données de l'utilisateur
    user.gameData.attemptsRemaining -= 1;

    // Si l'utilisateur a gagné des pâtisseries, les ajouter à son profil et mettre à jour le stock
    if (pastriesWon > 0) {
      for (let i = 0; i < pastriesWon; i++) {
        const pastry = await Pastry.findOne({ stock: { $gt: 0 } }).sort({ stock: -1 }).exec();
        if (pastry) {
          const wonPastry = {
            pastryId: pastry._id.toString(),
            wonAt: new Date(),
            name: pastry.name,
            image: pastry.image
          };
          user.gameData.pastryWon.push(wonPastry);
          pastry.stock -= 1;
          pastry.quantityWon += 1;
          await pastry.save();
        }
      }
    }

    await user.save();
    res.json({ dices, attemptsRemaining: user.gameData.attemptsRemaining, pastriesWon: user.gameData.pastryWon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
