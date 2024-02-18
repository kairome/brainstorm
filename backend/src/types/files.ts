import { TimeStampDocument } from '@/types/entities';

export enum FileBuckets {
  BoardThumbnails = 'boardThumbnails',
  UserAvatars = 'userAvatars',
  BoardImages = 'boardImages',
}

export interface FileDoc extends TimeStampDocument {
  fileName: string,
  bucket: FileBuckets,
}