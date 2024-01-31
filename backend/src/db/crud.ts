import { DbInstance } from './index';
import { Collection, Document, Filter, FindOptions, OptionalUnlessRequiredId } from 'mongodb';
import { UserDoc } from '@/types/user';

class DbCrud<T extends Document> {
  private readonly collection: Collection<T>;
  constructor(dbInstance: DbInstance, collectionName: string) {
    this.collection = dbInstance.getCollection(collectionName);
  }
  public async getAll() {
    const cursor = this.collection.find({});
    return cursor.toArray();
  }

  public async getOne(filters: Filter<T>, options?: FindOptions<T>) {
    return this.collection.findOne(filters, options);
  }

  public async createOne(doc: OptionalUnlessRequiredId<T>) {
    return await this.collection.insertOne(doc);
  }
}

export class UsersCrud extends DbCrud<UserDoc> {
  constructor(dbInstance: DbInstance) {
    super(dbInstance, 'users');
  }

  public async getUserByEmail(email: string) {
    return this.getOne({ email }, { projection: { passwordHash: 0 }});
  }
}