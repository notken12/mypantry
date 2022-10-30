import { model, Schema } from 'mongoose';

export type Id = string;
export type Item = {
	_id: Id;
	name: string;
	amount: number;
	imageURL: URL | null;
};

export interface Operation {
	type: string;
	uid: Id | null;
	data: Record<string, any>;
	timestamp: Date;
}

export type EditItems = Operation & {
	uid: Id;
	type: 'EditItems';
	data: {
		changes: Record<Id, Partial<Item>>;
	};
};
export type NewItem = Operation & {
	uid: Id;
	type: 'NewItem';
	data: {
		item: Item;
	};
};
export type CheckoutItems = Operation & {
	type: 'CheckoutItems';
	uid: Id | null;
	data: {
		optionalInfo: {
			firstName: string | null;
			lastName: string | null;
			additionalRemarks: string | null;
		};
		itemAmounts: Record<Id, number>;
		approved: boolean;
	};
};

export type Pantry = {
	_id: Id;
	name: string;
	description: string;
	createdDate: Date;
	inventory: Item[];
	owner: Id;
	editors: Id[];
	history: Operation[];
};
