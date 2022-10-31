import { DB_KEY } from '$env/static/private';
import mongoose, { Schema, model } from 'mongoose';
import type {
  Pantry,
  Item,
  Operation,
  OperationInterface,
  Editor
} from './Pantry';
import { nanoid } from 'nanoid';

if (DB_KEY == undefined)
  throw new Error("Error: couldn't find database key. Add DB_KEY=<database key here> to .env file");
await mongoose.connect(DB_KEY);

export const ItemSchema = new Schema<Item>({
  _id: {
    type: String,
    default: () => nanoid()
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  imageURL: {
    type: String,
    required: false
  }
});

export const OperationSchema = new Schema<Operation>(
  {
    _id: {
      type: String,
      default: nanoid
    },
    opType: {
      type: String,
      required: true
    },
    uid: String,
    data: Object
  },
  { timestamps: { createdAt: 'timestamp' } }
);

export const EditorSchema = new Schema<Editor>(
  {
    email: {
      type: String,
      required: true
    },
    uid: {
      type: String
    }
  },
  { id: false }
);

const PantrySchema = new Schema<Pantry>(
  {
    _id: {
      type: String,
      default: () => nanoid(11)
    },
    name: String,
    description: String,
    inventory: [ItemSchema],
    owner: String,
    editors: [EditorSchema],
    history: [OperationSchema]
  },
  { timestamps: true }
);

export const PantryModel = model<Pantry>('Pantry', PantrySchema);
