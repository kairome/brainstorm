import { DbInstance } from './index';
import { Collection, Document, Filter, FindOptions, ObjectId, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb';

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
    try {
      return this.collection.findOne({ _id: new ObjectId(id) } as any, options);
    } catch (e) {
      return null;
    }
  }

  protected async createOne(doc: OptionalUnlessRequiredId<T>) {
    return await this.collection.insertOne(doc);
  }

  protected async updateOne(doc: Partial<T>, updateDate: boolean = true) {
    const { _id, ...data } = doc;
    const updateDoc = {
      ...(data as Partial<T>),
    };

    if (updateDate) {
      (updateDoc as any).updatedAt = new Date();
    }

    return this.collection.updateOne({ _id: new ObjectId(_id) } as any, {
      $set: updateDoc,
    });
  }

  public async deleteOne(id: string) {
    return this.collection.deleteOne({ _id: new ObjectId(id) as any });
  }

  protected async updateOneRaw(doc: Partial<T>, updateOptions: UpdateFilter<T>) {
    return this.collection.updateOne({ _id: new ObjectId(doc._id) } as any, updateOptions);
  }
}

