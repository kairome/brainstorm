import { TimeStampDocument } from '@/types/entities';

export interface CreateBoardPayload {
  title: string,
  author: string,
}

export interface PublicBoardPermissions {
  anonUsers: {
    canEdit: boolean,
    canView: boolean,
  },
  registeredUsers: {
    canEdit: boolean,
    canView: boolean,
  },
}

export type BoardDoc = CreateBoardPayload & TimeStampDocument & {
  customThumbnail: boolean,
  modifiedBy: string | null,
  snapshot: {
    store: Record<string, any>,
    schema: Record<string, any>,
  },
  publicId: string,
  publicPermissions: PublicBoardPermissions,
};

export interface InvitedBoard {
  boardId: string,
  canEdit: boolean,
}