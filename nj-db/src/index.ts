import {
  IDatabaseOptions,
  IReadManyOptions,
  IReadOptions,
  IWriteOptions,
} from "./interface";

/**
 * Database
 * 
 * The database class
 */
class Database {
  projectId: string;
  cacheMaxAge: number;
  cacheAllocatedMemory: number;

  constructor(options: IDatabaseOptions) {
    if (!options.project_id) {
      throw Error("No project id provided");
    }
    this.projectId = options.project_id;
    this.cacheMaxAge = options.cache_max_age || 3600;
    this.cacheAllocatedMemory = options.cache_allocated_memory || 64;
  }

  async write<DocumentType>(
    { collection, id }: IWriteOptions,
    document: DocumentType
  ) {}

  async readOnce<DocumentType>({ collection, id }: IReadOptions) {}

  async readMany<DocumentType>({ collection }: IReadManyOptions) {}
}

export default Database;
