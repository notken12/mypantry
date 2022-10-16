import { model, Schema } from 'mongoose';

export type Item = {};
export type Id = string;

export type Pantry = {
  _id: Id;
  name: string;
  createdDate: Date;
  inventory: Item[];
  owner: Id;
  editors: Id[];
};
