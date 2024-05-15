import mongoose, { Schema, Document } from 'mongoose';

// Interface représentant une pâtisserie
export interface PastryDocument extends Document {
  name: string;
  image: string;
  stock: number;
  quantityWon: number;
}

const pastrySchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  quantityWon: { type: Number, default: 0 }
});

const Pastry = mongoose.model<PastryDocument>('Pastry', pastrySchema);

export default Pastry;
