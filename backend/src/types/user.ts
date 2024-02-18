import { TimeStampDocument } from '@/types/entities';

export interface CreateUserPayload {
  name: string,
  email: string,
  passwordHash: string,
}

export type UserDoc = CreateUserPayload & TimeStampDocument;