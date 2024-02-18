import { DbInstance } from './index';
import { Collection, Document, Filter, FindOptions, ObjectId, OptionalUnlessRequiredId } from 'mongodb';

export class DbCrud<T extends Document> {
  private readonly collection: Collection<T>;

  constructor(dbInstance: DbInstance, collectionName: string) {
    this.collection = dbInstance.getCollection(collectionName);
  }

  public async getAll(filters: Filter<T> = {}, options?: FindOptions<T>) {
    const cursor = this.collection.find(filters, options);
    return cursor.toArray();
  }

  public async getOne(filters: Filter<T>, options?: FindOptions<T>) {
    return this.collection.findOne(filters, options);
  }

  public async getOneById(id: string, options?: FindOptions<T>) {
    return this.collection.findOne({ _id: new ObjectId(id) } as any, options);
  }

  protected async createOne(doc: OptionalUnlessRequiredId<T>) {
    return await this.collection.insertOne(doc);
  }

  protected async updateOne(doc: Partial<T> & { id: string }) {
    return this.collection.updateOne({ _id: new ObjectId(doc.id) } as any, {
      $set: { ...doc, updatedAt: new Date() },
    });
  }
}

