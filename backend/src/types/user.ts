import { TimeStampDocument } from '@/types/entities';

export interface CreateUserPayload {
  name: string,
  email: string,
  passwordHash: string,
}

export type UserDoc = CreateUserPayload & TimeStampDocument & {
  boards: string[],
  favoriteBoards: string[],
};

export interface WsUser {
  id: string,
  email: string | null,
  name: string,
  isAnonymous: boolean,
}