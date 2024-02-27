import { CreateUserPayload, UserDoc } from '@/types/user';
import { DbInstance } from '@/db/index';
import { ObjectId } from 'mongodb';
import { DbCrud } from '@/db/crud';

export class UsersCrud extends DbCrud<UserDoc> {
  constructor(dbInstance: DbInstance) {
    super(dbInstance, 'users');
  }

  public async getUserByEmail(email: string) {
    return this.getOne({ email }, { projection: { passwordHash: 0 } });
  }

  public async getUserById(id: string) {
    return this.getOne({ _id: new ObjectId(id) }, { projection: { passwordHash: 0 } });
  }

  public async createUser(data: CreateUserPayload) {
    return this.createOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      boards: [],
      favoriteBoards: [],
    });
  }

  public async setBoardFavorite(userId: string, boardId: string, adding: boolean = true) {
    const update = adding ? {
      $push: { favoriteBoards: boardId },
    } : {
      $pull: { favoriteBoards: boardId }
    };
    return this.updateOneRaw({ _id: userId }, update as any);
  }

  public async setBoard(userId: string, boardId: string, adding: boolean = true) {
    const update = adding ? {
      $push: { boards: boardId },
    } : {
      $pull: { boards: boardId }
    };
    return this.updateOneRaw({ _id: userId }, update as any);
  }
}