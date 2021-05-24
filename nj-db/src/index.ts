const Firestore = require("@google-cloud/firestore");

import DataCacheStorage from "./cache";
import {
  IDatabaseOptions,
  ICollectionOptions,
  IDocumentOptions,
  ICollectionFilters,
} from "./interface";

/**
 * Database
 *
 * Class for saving and querying firebase firestore
 *
 * @param project_id string Google Cloud Platform project ID
 * @param cache_max_age string Cached data age threshold (default: 3600)
 * @param cache_allocated_memory Maximum in-memory cache size, in megabytes (default: 64MB)
 */
class Database {
  projectId: string;
  db: any;
  dataCache: DataCacheStorage;

  constructor(options: IDatabaseOptions) {
    if (!options.project_id) {
      throw Error("No project id provided");
    }
    this.projectId = options.project_id;

    this.db = new Firestore({
      projectId: this.projectId,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    this.dataCache = new DataCacheStorage(
      options.cache_max_age,
      options.cache_allocated_memory
    );
  }

  private getCollectionRef(collection: string) {
    return this.db.collection(collection);
  }

  /**
   * Write an object to the database
   *
   * Writes a document to the database, and to the in-memory cache.
   *
   * This method does not return anything.
   *
   * @param IDocumentOptions
   * @param DocumentType
   */
  async write<DocumentType>(
    { collection, id }: IDocumentOptions,
    document: DocumentType
  ) {
    const docRef = this.getCollectionRef(collection).doc(id);
    await docRef.set(document, { merge: true });

    this.dataCache.setData({ collection, id }, document);
  }

  /**
   * Read an object form the database
   *
   * Retrieves a single document from the database, or,
   * if applicable, from the in-memory cache.
   *
   * This method returns a single document, an object,
   * whose type is to be inferred by the DataType generic.
   * If the document does not exist, the method throws an error.
   *
   * @param IDocumentOptions
   * @returns DocumentType
   */
  async readOne<DocumentType>({
    collection,
    id,
  }: IDocumentOptions): Promise<DocumentType> {
    const cachedDoc = this.dataCache.getData<DocumentType>({ collection, id });
    if (cachedDoc) {
      return cachedDoc;
    }

    const docRef = this.getCollectionRef(collection).doc(id);
    const liveDoc = await docRef.get();

    const docData = liveDoc.data();

    if (!docData) {
      throw new Error(
        `No document with this id: ${id} was found in this collection: ${collection}`
      );
    }

    this.dataCache.setData({ collection, id }, docData);

    return { id: liveDoc.id, ...docData };
  }

  /**
   * Read many from a collection
   *
   * Retrieves a set of documents from the database. Always queries the firebase store
   *
   * Entries are never the less stored in cache and individual objects retrieved
   * from cache (if they exist using ReadOne)
   *
   * Filters only filter keys that are equal for now. May be extended later
   * for other operations
   *
   * This method returns an array of documents,
   * whose type is to be inferred by the DataType generic.
   *
   * @param ICollectionOptions
   * @param ICollectionFilters
   * @returns DocumentType[]
   */
  async readMany<DocumentType>(
    { collection }: ICollectionOptions,
    filters: ICollectionFilters = {}
  ): Promise<DocumentType[]> {
    let colRef = this.getCollectionRef(collection);

    Object.keys(filters).forEach((filterKey) => {
      colRef = colRef.where(filterKey, "==", filters[filterKey]);
    });

    const snapshot = await colRef.get();

    if (snapshot.empty) {
      throw new Error(
        `No result matches the collection: ${collection} and filter supplied`
      );
    }

    let result: DocumentType[] = [];
    snapshot.forEach((snap: any) => {
      result.push({ id: snap.id, ...snap.data() } as DocumentType);
      this.dataCache.setData({ collection, id: snap.id }, snap.data());
    });
    return result;
  }
}

export default Database;
