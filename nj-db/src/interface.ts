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
 * Database write method options
 */
export interface IWriteOptions {
  collection: string;
  id: string;
}

/**
 * Database read one/retrieve method options
 */
export interface IReadOptions {
  collection: string;
  id: string;
};

/**
 * Database read many/list method options
 */
export interface IReadManyOptions {
  collection: string;
}
