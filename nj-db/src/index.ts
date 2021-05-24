import DataCacheStorage from "./cache";
import {
  IDatabaseOptions,
  ICollectionOptions,
  IDocumentOptions,
} from "./interface";

const Firestore = require("@google-cloud/firestore");

/**
 * Database
 *
 * The database class
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

  async write<DocumentType>(
    { collection, id }: IDocumentOptions,
    document: DocumentType
  ) {
    const docRef = this.getCollectionRef(collection).doc(id);
    await docRef.set(document);

    this.dataCache.setData({ collection, id }, document);
  }

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

    this.dataCache.setData({ collection, id }, liveDoc);

    return liveDoc;
  }

  async readMany<DocumentType>(
    { collection }: ICollectionOptions,
    filters: any
  ): Promise<DocumentType[]> {
    const snapshot = this.getCollectionRef(collection).get();
    return snapshot.map((snap: any) => snap.data() as DocumentType);
  }
}

export default Database;
