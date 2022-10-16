import { model, Schema } from 'mongoose';

export type Item = {
  _id: Id;
  name: string;
  imageURL: URL | null;
};
export type Id = string;

export type Pantry = {
  _id: Id;
  name: string;
  createdDate: Date;
  inventory: Item[];
  owner: Id;
  editors: Id[];
};
