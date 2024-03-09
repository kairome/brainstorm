import { Document } from 'mongodb';
import { WebSocket } from 'ws';
import { BoardDoc } from '@/types/boards';

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

export type WsClient = WebSocket & {
  isAlive: boolean,
}

export type WsBoard = BoardDoc & {
  isPublic: boolean,
}