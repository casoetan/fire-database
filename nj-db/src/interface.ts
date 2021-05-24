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
 * Database collection interface
 */
export interface ICollectionOptions {
  collection: string;
}

/**
 * Database document interface
 */
export interface IDocumentOptions extends ICollectionOptions {
  id: string;
}

/**
 * Database collection filter interface
 */
export interface ICollectionFilters {
  [name: string]: any;
}

/**
 * Cache data object interface
 */
export interface ICacheData<T> {
  entryTime: number;
  data: T;
}

/**
 * Cache data collection interface
 */
export interface ICacheObj<T> {
  [id: string]: ICacheData<T>;
}
