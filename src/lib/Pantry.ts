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
  data: Record<string, unknown>;
  timestamp: Date;
}

export type EditItems = OperationInterface & {
  uid: Id;
  opType: 'EditItems';
  data: {
    old: Record<Id, Partial<Item>>;
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

export type CheckoutData = {
  optionalInfo: {
    firstName: string | null;
    lastName: string | null;
    additionalRemarks: string | null;
  };
  itemAmounts: Record<Id, number>;
  approved: boolean;
  pending: boolean;
};

export type CheckoutItems = OperationInterface & {
  opType: 'CheckoutItems';
  uid: Id | null;
  data: CheckoutData;
};

export type ApproveCheckout = {
  opType: 'ApproveCheckout';
  uid: Id;
  data: { requestOpId: Id; approvalStatus: boolean };
};

export type AddEditors = OperationInterface & {
  opType: 'AddEditors';
  uid: Id;
  data: {
    editorsToAdd: { email: string; uid: Id | null }[];
  };
};

export type Operation = OperationInterface &
  (EditItems | NewItem | CheckoutItems | EditInfo | AddEditors | ApproveCheckout);

export type Editor = { uid: Id | null; email: string };

export type Pantry = {
  _id: Id;
  name: string;
  description: string;
  address: string;
  createdDate: Date;
  inventory: Item[];
  owner: Id;
  editors: Editor[];
  history: Operation[];
};
