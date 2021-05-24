import { ICacheData, ICacheObj, IDocumentOptions } from "./interface";

/**
 * DataCacheStore
 * 
 * Class to cache data in memory and save round trip of fetching from firestore
 * Can dramatically improve the latency of your application
 */
class DataCacheStorage {
  cache: Record<string, ICacheObj<any>>;
  cacheMaxAge: number;
  cacheAllocatedMemory: number;

  constructor(cacheMaxAge = 3600, cacheAllocatedMemory = 64) {
    this.cache = {};
    this.cacheMaxAge = cacheMaxAge * 1000; // convert max cache age to milliseconds
    this.cacheAllocatedMemory = cacheAllocatedMemory;
  }

  private docHasExpired<DocumentType>(
    cache: ICacheData<DocumentType>
  ): boolean {
    if (cache.entryTime + this.cacheMaxAge < Date.now()) {
      return true;
    }
    return false;
  }

  private cacheMemoryIsFull() {
    // TODO: Check if cache memory is full
    return false;
  }

  /**
   * Get data from cache if it exist or returns null
   * 
   * @param IDocumentOptions 
   * @returns DocumentType
   * @returns null
   */
  getData<DocumentType>({
    collection,
    id,
  }: IDocumentOptions): DocumentType | null {
    if (Object.keys(this.cache).length < 1 || !this.cache[collection]) {
      return null;
    }
    
    const doc = this.cache[collection][id];

    if (!doc) {
      return null;
    }

    if (this.docHasExpired(doc)) {
      delete this.cache[collection][id];
      return null;
    }

    return doc.data;
  }

  /**
   * Set data in cache
   * 
   * @param IDocumentOptions 
   * @param DocumentType 
   */
  setData<DocumentType>(
    { collection, id }: IDocumentOptions,
    data: DocumentType
  ) {
    if (this.cacheMemoryIsFull()) {
      // TODO: Remove objects from cache
    }
    if (Object.keys(this.cache).length < 1 || !this.cache[collection]) {
      this.cache[collection] = {};
    }

    const cacheData: ICacheData<DocumentType> = {
      entryTime: Date.now(),
      data: data,
    };

    this.cache[collection][id] = cacheData;
  }
}

export default DataCacheStorage;
