import { DB_KEY } from '$env/static/private';
import mongoose, { Schema, model } from 'mongoose';
import type { Pantry, Item, Operation, CheckOutRequest } from './Pantry';
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
		type: Number,
		required: true
	},
	imageURL: {
		type: String,
		required: false
	}
});

const OperationSchema = new Schema<Operation>(
	{
		type: {
			type: String,
			required: true
		},
		uid: String,
		data: Object
	},
	{ timestamps: { createdAt: 'timestamp' } }
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
		editors: [String],
		history: [OperationSchema]
	},
	{ timestamps: true }
);

const CheckOutRequestSchema = new Schema<CheckOutRequest>({
  pantryId: {
    type: String,
    default: () => nanoid(11)
  },
  firstName: String,
  lastName: String,
  additionalRemarks: String,
  createdDate: {
    type: Date,
    default: () => Date.now()
  },
});
export const PantryModel = model<Pantry>('Pantry', PantrySchema);
