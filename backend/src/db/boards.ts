import { BoardDoc, CreateBoardPayload } from '@/types/boards';
import { DbInstance } from '@/db/index';
import { DbCrud } from '@/db/crud';

export class BoardsCrud extends DbCrud<BoardDoc> {
  constructor(dbInstance: DbInstance) {
    super(dbInstance, 'boards');
  }

  public async getByAuthor(authorId: string) {
    return this.getAll({ author: authorId });
  }

  public async create(data: CreateBoardPayload) {
    return this.createOne({
      ...data,
      customThumbnail: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public async setTitle(boardId: string, title: string) {
    return this.updateOne({ id: boardId, title });
  }

  public async setCustomThumbnail(boardId: string, customThumbnail: boolean) {
    return this.updateOne({ id: boardId, customThumbnail });
  }
}