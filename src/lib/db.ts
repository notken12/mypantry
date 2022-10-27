import { DB_KEY } from '$env/static/private';
import mongoose, { Schema, model } from 'mongoose';
import type { Pantry, Item } from './Pantry';
import { nanoid } from 'nanoid';

if (DB_KEY == undefined)
  throw new Error("Error: couldn't find database key. Add DB_KEY=<database key here> to .env file");
await mongoose.connect(DB_KEY);

const ItemSchema = new Schema<Item>({
  _id: {
    type: String,
    default: () => nanoid()
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type:Number,
    required:true
  },
  imageURL: {
    type: String,
    required: false
  }
});

const PantrySchema = new Schema<Pantry>({
  _id: {
    type: String,
    default: () => nanoid(11)
  },
  name: String,
  description: String,
  createdDate: {
    type: Date,
    default: () => Date.now()
  },
  inventory: [ItemSchema],
  owner: String,
  editors: [String]
});
export const PantryModel = model<Pantry>('Pantry', PantrySchema);
