import { Db, Document, MongoClient } from 'mongodb';
import { DB_CONNECTION } from '@/config';
import { UsersCrud } from '@/db/crud';

export class DbInstance {
  private readonly client: MongoClient;
  private readonly db: Db | null;

  constructor(dbName: string) {
    this.client = new MongoClient(DB_CONNECTION);
    this.db = this.client.db(dbName);
    console.log(`Connected to ${dbName} database!`);
  }

  public getCollection<T extends Document>(colName: string) {
    if (!this.db) {
      throw new Error('No db instance present');
    }

    return this.db.collection<T>(colName);
  }
}

const dbInstance = new DbInstance('sample');
const userCrud = new UsersCrud(dbInstance);

export default {
  dbInstance,
  userCrud,
};