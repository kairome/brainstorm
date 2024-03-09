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

  public async getUserById(id: string, full: boolean = false) {
    const projection = full ? {} : { passwordHash: 0 };
    return this.getOne({ _id: new ObjectId(id) }, {
      projection,
    });
  }

  public async createUser(data: CreateUserPayload) {
    return this.createOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      favoriteBoards: [],
      color: null,
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

  public async updateUserInfo(userId: string, updateObj: { color?: string, name?: string }) {
    return this.updateOne({
      _id: userId,
      ...updateObj,
    });
  }

  public async updateUserPassHash(userId: string, passwordHash: string) {
    return this.updateOne({
      _id: userId,
      passwordHash,
    });
  }
}