import { CreateUserPayload, UserDoc } from '@/types/user';
import { DbInstance } from '@/db/index';
import { ObjectId } from 'mongodb';
import { DbCrud } from '@/db/crud';
import { InvitedBoard } from '@/types/boards';

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
      invitedBoards: [],
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

  public async addBoard(userId: string, invitedBoard: InvitedBoard) {
    return this.updateOneRaw({ _id: userId }, {
      $push: { invitedBoards: invitedBoard } as any
    })
  }
}