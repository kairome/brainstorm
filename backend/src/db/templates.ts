import { DbCrud } from '@/db/crud';
import { DbInstance } from '@/db/index';
import { TemplateDoc } from '@/types/templates';

export class TemplatesCrud extends DbCrud<TemplateDoc> {
  constructor(dbInstance: DbInstance) {
    super(dbInstance, 'boards');
  }

  public async createFromSnapshot(owner: string, boardTitle: string, snapshot: TemplateDoc['snapshot']) {
    return this.createOne({
      title: `${boardTitle} template`,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner,
      snapshot,
    });
  }

  public async getByOwner(owner: string, searchText?: string) {
    const searchFilter = searchText ? {
      title: {
        $regex: searchText,
        $options: 'i',
      },
    } : {};

    return this.getAll({
      owner,
      ...searchFilter,
    }, {
      sort: { createdAt: -1 }
    });
  }

  public async saveSnapshot(id: string, snapshot: TemplateDoc['snapshot']) {
    return this.updateOne({
      _id: id,
      snapshot,
    });
  }

  public async updateTitle(id: string, title: string) {
    return this.updateOne({
      _id: id,
      title,
    });
  }

  public async removeAllOwnerTemplates(owner: string) {
    return this.deleteMany({
      owner,
    });
  }
}