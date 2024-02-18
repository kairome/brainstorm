import { Document } from 'mongodb';

export interface YupError extends Error {
  errors: string[],
  inner: {
    path: string,
    message: string,
  }[],
}

export interface ValidationError {
  name: string,
  message: string,
}

export interface TimeStampDocument extends Document {
  createdAt: Date,
  updatedAt: Date,
}