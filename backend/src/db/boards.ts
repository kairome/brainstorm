import { BoardDoc, CreateBoardPayload } from '@/types/boards';
import { DbInstance } from '@/db/index';
import { DbCrud } from '@/db/crud';

export class BoardsCrud extends DbCrud<BoardDoc> {
  constructor(dbInstance: DbInstance) {
    super(dbInstance, 'boards');
  }

  public async getByAuthor(authorId: string) {
    return this.getAll({ author: authorId }, {
      sort: {
        createdAt: -1
      }
    });
  }

  public async create(data: CreateBoardPayload) {
    return this.createOne({
      ...data,
      customThumbnail: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      modifiedBy: null,
    });
  }

  public async setTitle(boardId: string, title: string, modifiedBy: string) {
    return this.updateOne({ id: boardId, title, modifiedBy });
  }

  public async setCustomThumbnail(boardId: string, customThumbnail: boolean, modifiedBy: string) {
    return this.updateOne({ id: boardId, customThumbnail, modifiedBy });
  }
}