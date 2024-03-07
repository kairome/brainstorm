import { BoardDoc, CreateBoardPayload, InvitedUser, PublicBoardPermissions } from '@/types/boards';
import { DbInstance } from '@/db/index';
import { DbCrud } from '@/db/crud';
import { ObjectId } from 'mongodb';
import _ from 'lodash';
import boardSnapshot from '@/utils/boardSnapshot';
import { v4 } from 'uuid';
import { TemplateDoc } from '@/types/templates';

export class BoardsCrud extends DbCrud<BoardDoc> {
  constructor(dbInstance: DbInstance) {
    super(dbInstance, 'boards');
  }

  public async getByAuthor(authorId: string, searchText?: string) {
    const searchFilter = searchText ? {
      title: {
        $regex: searchText,
        $options: 'i',
      },
    } : {};

    return this.getAll({ author: authorId, ...searchFilter }, {
      sort: {
        createdAt: -1
      },
      projection: {
        snapshot: 0,
        invitedUsers: 0,
      },
    });
  }

  public async getMembers(userId: string) {
    const userBoards = await this.getAll({
      author: userId,
      invitedUsers: {
        $exists: true,
        $ne: [],
      },
    }, {
      projection: {
        _id: 1,
        title: 1,
        invitedUsers: 1,
      },
    });

    const members = _.flatMap(userBoards, b => {
      return _.map(b.invitedUsers, user => ({
        ...user,
        boards: [{ id: String(b._id), title: b.title, canEdit: user.canEdit }],
      }));
    });

    const grouped = _.groupBy(members, 'email');

    return _.map(grouped, (val, key) => {
      const { userId, email, name } = val[0];
      return {
        userId,
        email,
        name,
        boards: _.flatMap(val, b => b.boards),
      };
    });
  }

  public async removeMember(author: string, email: string) {
    return this.updateManyRaw({
      author,
    }, {
      $pull: {
        invitedUsers: { email },
      } as any,
    });
  }

  public async removeMemberFromBoards(author: string, email: string, boardIds: string[]) {
    const boardObjectIds = _.map(boardIds, bid => new ObjectId(bid));
    return this.updateManyRaw({
      author,
      _id: { $in: boardObjectIds }
    }, {
      $pull: {
        invitedUsers: { email },
      } as any,
    });
  }

  public async updateBoardMemberPerms(author: string, boardId: string, memberEmail: string, canEdit: boolean) {
    return this.updateOneWithFilters({
      _id: new ObjectId(boardId),
      author,
      'invitedUsers.email': memberEmail,
    }, {
      $set: { 'invitedUsers.$.canEdit': canEdit }
    });
  }

  public async getSharedBoards(userId: string, searchText?: string) {
    const searchFilter = searchText ? {
      title: {
        $regex: searchText,
        $options: 'i',
      },
    } : {};

    return this.getAll({
      invitedUsers: {
        $elemMatch: {
          userId,
        }
      }, ...searchFilter
    }, {
      sort: {
        createdAt: -1
      },
      projection: {
        snapshot: 0,
        invitedUsers: 0,
      },
    });
  }

  public async create(data: CreateBoardPayload) {
    return this.createOne({
      ...data,
      snapshot: boardSnapshot,
      customThumbnail: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      modifiedBy: null,
      publicId: v4(),
      publicPermissions: {
        anonUsers: {
          canView: false,
          canEdit: false,
        },
        registeredUsers: {
          canView: true,
          canEdit: false,
        },
      },
      invitedUsers: [],
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
    });
  }

  public async setPublicBoardPerms(boardId: string, perms: PublicBoardPermissions) {
    return this.updateOne({
      _id: boardId,
      publicPermissions: perms,
    });
  }

  public async getBoardByPublicId(publicId: string) {
    return this.getOne({
      publicId,
    }, {
      projection: {
        snapshot: 0,
        modifiedBy: 0,
        author: 0,
      },
    });
  }

  public async createFromTemplate(template: TemplateDoc) {
    return this.createOne({
      title: template.title,
      snapshot: template.snapshot,
      author: template.owner,
      customThumbnail: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      modifiedBy: null,
      publicId: v4(),
      publicPermissions: {
        anonUsers: {
          canView: false,
          canEdit: false,
        },
        registeredUsers: {
          canView: true,
          canEdit: false,
        },
      },
      invitedUsers: [],
    });
  }

  public async addInvitedUser(boardId: string, invitedUser: InvitedUser) {
    return this.updateOneRaw({
      _id: boardId,
    }, {
      $push: { invitedUsers: invitedUser }
    } as any);
  }

  public async updateInvitedUserInfo(email: string, userId: string, name: string) {
    return this.updateManyRaw({
      'invitedUsers.email': email,
    }, {
      $set: {
        'invitedUsers.$.userId': userId,
        'invitedUsers.$.name': name,
      }
    });
  }
}