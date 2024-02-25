import { BoardDoc, CreateBoardPayload } from '@/types/boards';
import { DbInstance } from '@/db/index';
import { DbCrud } from '@/db/crud';
import { ObjectId } from 'mongodb';
import _ from 'lodash';
import boardSnapshot from '@/utils/boardSnapshot';

export class BoardsCrud extends DbCrud<BoardDoc> {
  constructor(dbInstance: DbInstance) {
    super(dbInstance, 'boards');
  }

  public async getByAuthor(authorId: string) {
    return this.getAll({ author: authorId }, {
      sort: {
        createdAt: -1
      },
      projection: {
        snapshot: 0,
      },
    });
  }

  public async getSharedBoards(boardIds: string[]) {
    return this.getAll({ _id: { $in: _.map(boardIds, bid => new ObjectId(bid)) } }, {
      sort: {
        createdAt: -1
      },
      projection: {
        snapshot: 0,
      },
    });
  }

  public async create(data: CreateBoardPayload) {
    return this.createOne({
      ...data,
      customThumbnail: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      modifiedBy: null,
      snapshot: boardSnapshot,
    });
  }

  public async setTitle(boardId: string, title: string, modifiedBy: string) {
    return this.updateOne({ _id: boardId, title, modifiedBy });
  }

  public async setCustomThumbnail(boardId: string, customThumbnail: boolean, modifiedBy: string) {
    return this.updateOne({ _id: boardId, customThumbnail, modifiedBy });
  }

  public async updateSnapshot(boardId: string, snapshot: BoardDoc['snapshot'], modifiedBy: string) {
    return this.updateOne({
      _id: boardId,
      snapshot,
      modifiedBy,
    })
  }
}