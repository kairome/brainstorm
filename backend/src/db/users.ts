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

  public async addBoard(userId: string, boardId: string) {
    return this.updateOneRaw({ id: userId }, {
      $push: {
        boards: boardId as any,
      },
    });
  }
}