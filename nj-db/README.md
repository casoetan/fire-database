# [nj-db](https://www.npmjs.com/package/@casoetan/nj-db) 

This NPM package provides a simple interface for saving and retrieving data to and from a database.

There's nothing more core to a web application than reading from and writing to its database. This package provides methods to enable just that: reading from a database, and writing to a database.

## NPM package
In particular, this package reads from and writes to a [GCP Firestore](https://cloud.google.com/firestore/docs) database.

But it also does a bit more. When writing data, the package saves that data to an in-memory cache. When retrieving data, it first checks its in-memory cache for matching data. If a match for the query is found, and if the match is sufficiently fresh, it will return that data without querying Firestore.

The size of the cache is limited. The package will have to make sure that the size of the cache – in bytes – never eclipses its allocation.

## Usage
- Create application in GCP
- Download config file
- Add path to the GCP config file to env. Use the keyword: GOOGLE_APPLICATION_CREDENTIALS

An example environment is in `.env.sample`

## Examples of using this library

### Retrieve an entry from a firestore collection (users)
```js
    const db = new Database({ project_id: process.env.GCP_PROJECT_ID });
    // Read an entry from a db
    const result = await db.readOne({ collection: 'users', id: '1234' });
    return res.send(result);
```

### List all values from a firestore collection (users)
```js
    const db = new Database({ project_id: process.env.GCP_PROJECT_ID });
    // This also allows filtering
    const result = await db.readMany({ collection: 'users' });
    return res.send(result);
```

### Create an entry in a firestore collection (users)
```js
    const db = new Database({ project_id: process.env.GCP_PROJECT_ID });
    const id = uuid4()
    db.write({ collection: 'users', id }, body: {name: 'Dji'});
    res.statusCode = 201
    return res.end();
```

## TODO
* Pagination of entries
* Database memory management
* Filters other than equal
