/**
 * Database interface options
 * 
 * Options required to initialize the database object
 */
export interface IDatabaseOptions {
  project_id: string;
  cache_max_age?: number;
  cache_allocated_memory?: number;
}

/**
 * Firebase collection interface
 */
export interface ICollectionOptions {
  collection: string;
}


/**
 * Firebase document interface
 */
export interface IDocumentOptions extends ICollectionOptions {
  id: string;
}

export interface ICacheData<T> {
  entryTime: number
  data: T
}

export interface ICacheObj<T> {
  [id: string]: ICacheData<T>
}
