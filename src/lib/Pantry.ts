import { model, Schema } from 'mongoose';

export type Id = string;
export type Item = {
	_id: Id;
	name: string;
	amount: number;
	imageURL: URL | null;
};

export interface OperationInterface {
	_id: Id;
	opType: string;
	uid: Id | null;
	data: Record<string, any>;
	timestamp: Date;
}

export type EditItems = OperationInterface & {
	uid: Id;
	opType: 'EditItems';
	data: {
		changes: Record<Id, Partial<Item>>;
	};
};
export type NewItem = OperationInterface & {
	uid: Id;
	opType: 'NewItem';
	data: {
		item: Item;
	};
};
export type EditInfo = OperationInterface & {
	uid: Id;
	opType: 'EditInfo';
	data: {
		newInfo: Partial<Pantry>;
	};
};

export type CheckoutItems = OperationInterface & {
	opType: 'CheckoutItems';
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

export type Operation = EditItems | NewItem | CheckoutItems | EditInfo;

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
