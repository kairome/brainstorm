import { TimeStampDocument } from '@/types/entities';

export interface CreateBoardPayload {
  title: string,
  author: string,
}

export type BoardDoc = CreateBoardPayload & TimeStampDocument & {
  customThumbnail: boolean,
  modifiedBy: string | null,
  snapshot: {
    store: Record<string, any>,
    schema: Record<string, any>,
  },
};