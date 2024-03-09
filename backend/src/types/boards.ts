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

export interface InvitedUser {
  userId: string | null,
  name: string | null,
  canEdit: boolean,
  email: string,
}

export interface BoardChatMessage {
  text: string,
  date: string,
  user: {
    name: string,
    id: string,
    isAnon: boolean,
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
  invitedUsers: InvitedUser[],
  chatMessages: BoardChatMessage[],
};

export interface MemberBoardsPermissions {
  email: string,
  boards: {
    boardId: string,
    canEdit: boolean,
    removed: boolean,
  }[],
}