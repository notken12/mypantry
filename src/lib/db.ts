import { DB_KEY } from '$env/static/private';
import mongoose, { Schema, model } from 'mongoose';
import type { Pantry, Item } from './Pantry';

if (DB_KEY == undefined)
  throw new Error("Error: couldn't find database key. Add DB_KEY=<database key here> to .env file");
await mongoose.connect(DB_KEY);

const ItemSchema = new Schema<Item>({});

const PantrySchema = new Schema<Pantry>({
  _id: {
    type: String,
    default: () => crypto.randomUUID()
  },
  name: String,
  createdDate: Date,
  inventory: [ItemSchema],
  owner: String,
  editors: [String]
});
export const PantryModel = model<Pantry>('Pantry', PantrySchema);
