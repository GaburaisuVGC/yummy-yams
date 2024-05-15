const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import authMiddleware from './middleware/authMiddleware';
import gameRoutes from './routes/gameRoutes';
import stockRoutes from './routes/stockRoutes';

// Chargement des variables d'environnement depuis le fichier .env
dotenv.config();

// Initialisation de l'application Express
const app = express();

// Middleware pour activer CORS
app.use(cors());

// Middleware pour permettre la lecture du corps des requêtes au format JSON
app.use(express.json());

// Routes d'authentification
app.use('/auth', authRoutes);

app.use('/user', authMiddleware, userRoutes);

app.use('/game', authMiddleware, gameRoutes);

app.use('/stock', stockRoutes);

// Connexion à la base de données MongoDB
const mongoURI = process.env.MONGO_URI || '';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err: any) => console.error('MongoDB connection error:', err));


// Définition des routes
app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('Hello World!');
});

// Port sur lequel le serveur écoutera les requêtes
const PORT = parseInt(process.env.PORT || '3001');

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
