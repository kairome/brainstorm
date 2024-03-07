import { TimeStampDocument } from '@/types/entities';

export interface CreateUserPayload {
  name: string,
  email: string,
  passwordHash: string,
}

export type UserDoc = CreateUserPayload & TimeStampDocument & {
  favoriteBoards: string[],
};

export interface WsAnonUser {
  id: string,
  email: null,
  name: string,
  isAnonymous: true,
}

export type WsFullUser = Partial<UserDoc> & {
  id: string,
  email: string,
  name: string,
  isAnonymous: false,
}

export type WsUser = WsFullUser | WsAnonUser;