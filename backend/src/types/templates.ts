import { TimeStampDocument } from '@/types/entities';
import { BoardDoc } from '@/types/boards';

export type TemplateDoc = TimeStampDocument & {
  title: string,
  owner: string,
  snapshot: BoardDoc['snapshot'],
};