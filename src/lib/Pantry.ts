import { model, Schema } from 'mongoose';

export type Item = {
  _id: Id;
  name: string;
  amount: number;
  imageURL: URL | null;
};
export type Id = string;

export type Pantry = {
  _id: Id;
  name: string;
  description: string;
  createdDate: Date;
  inventory: Item[];
  owner: Id;
  editors: Id[];
};

export type CheckOutRequest = {
  pantryId: Id;
  firstName: string;
  lastName: string;
  createdDate: Date;
  additionalRemarks: string;
  checkout: Record<Id, number>;

}
