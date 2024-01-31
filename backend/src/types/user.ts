import { Document } from 'mongodb';

export interface UserDoc extends Document {
  name: string,
  email: string,
  passwordHash: string,
}