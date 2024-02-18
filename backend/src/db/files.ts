import { DbCrud } from '@/db/crud';
import { DbInstance } from '@/db/index';
import { FileDoc } from '@/types/files';

export class FilesCrud extends DbCrud<FileDoc> {
  constructor(dbInstance: DbInstance) {
    super(dbInstance, 'files');
  }
}