import mongoose, { Schema, Document } from 'mongoose';

// Interface représentant les informations sur une pâtisserie gagnée
interface WonPastry {
  pastryId: string;
  wonAt: Date;
  name: string;
  image: string;
}

// Interface représentant les données du jeu pour un utilisateur
interface GameData {
  attemptsRemaining: number; // Nombre de tentatives restantes pour lancer les dés
  pastryWon: Array<WonPastry>; // Pâtisseries gagnées par l'utilisateur
}

export interface UserDocument extends Document {
  username: string;
  password: string;
  gameData: GameData; // Données du jeu associées à l'utilisateur
}

const wonPastrySchema: Schema = new Schema({
  pastryId: { type: Schema.Types.ObjectId, ref: 'Pastry', required: true },
  wonAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const gameDataSchema: Schema = new Schema({
  attemptsRemaining: { type: Number, default: 3 }, // Par défaut, l'utilisateur a 3 tentatives
  pastryWon: [wonPastrySchema] // Référence aux pâtisseries gagnées par l'utilisateur
});

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gameData: gameDataSchema
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
