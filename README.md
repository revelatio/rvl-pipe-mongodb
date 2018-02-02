# rvl-pipe-mongodb

[![Build Status](https://travis-ci.org/revelatio/rvl-pipe-mongodb.svg?branch=master)](https://travis-ci.org/revelatio/rvl-pipe-mongodb)
[![Coverage Status](https://coveralls.io/repos/github/revelatio/rvl-pipe-mongodb/badge.svg?branch=master)](https://coveralls.io/github/revelatio/rvl-pipe-mongodb?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/revelatio/rvl-pipe-mongodb/badge.svg)](https://snyk.io/test/github/revelatio/rvl-pipe-mongodb)

rvl-pipe-mongodb is a small set of
[rvl-pipe](https://github.com/revelatio/rvl-pipe) style wrappers for mongodb.
It just cover a small set of connection, query and update functions.

[rvl-pipe](https://github.com/revelatio/rvl-pipe) library provides a way
to compose async functions using a pipeline approach. Every rvl-pipe function
has a simple construct.

```javscript
const myAsycTask = (taskParams) => context => {
    // Do async tasks
    // Mutate context, perform side-effects

    return context
}
```

For Mongodb the set of functions are of 3 types: connection, query and updates.

## Connection

- `connectMongoDB`: Creates a connection step, You need to pass url and dbName.
Only runs once. So you can use the same step several times without actually
attempting the connection process. It will add a `mongodb` property to the context.

```javascript
return startWith()
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(should(prop('mongodb'), 'NoMongoDBConnection'))
```

- `closeMongoDB`: Closes the DB connection that exists on the context.

```javascript
return startWith()
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    // Do some DB operations
    .then(closeMongoDB())
```

## Queries

- `runQueryOne`: Performs a simple `findOne` query. We need to especify, collection,
filter and property name to store value.

```javascript
return startWith()
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(runQueryOne('contacts', { _id: uidToFind }, 'foundContact'))
    .then(should(prop('foundContact'), 'ContactNotFound'))
```

You can also use dynamic data for the filter

```javascript
return startWith({ contactId: '209889833' })
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(runQueryOne('contacts', props({ _id: prop('contactId') }), 'foundContact'))
    .then(should(prop('foundContact'), 'ContactNotFound'))
```

- `runQuery`: Similar to `runQueryOne` but returning all resulting documents. (This function is not designed to be
performant in terms of memory consumption since it uses the `toArray()` on the resulting `find` cursor.


```javascript
return startWith({ owner: '209889833' })
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(runQuery('projects', props({ owner: prop('owner') }), 'ownerProjects'))
    .then(should(prop('ownerProjects'), 'ProjectsNotFound'))
```

- `runQueryExists`: Exactly as `runQueryOne` but will return **true** | **false**
if the document exists on the DB

```javascript
return startWith()
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(runQueryExists('contacts', { _id: uidToFind }, 'foundContact'))
    .then(should(prop('foundContact'), 'ContactNotFound'))
```

## Creating and Updating documents

- `createDocument`: Creates a simple document passing the collection and the data for it.

```javascript
return startWith()
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(createDocument('contacts', { _id: cuid(), name: 'John', last: 'Doe' }, 'newContact'))
    .then(should(prop('newContact'), 'ContactNotCreated'))
```

- `updateDocumentOne`: Updates one document passing the collection, the filter to
find the document we want to change and the mutation object.

```javascript
return startWith()
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(updateDocumentOne('contacts', { _id: uidToChange }, { $set: { name: 'Mary' } }))
```

- `upsertDocument`: This function will create a step to upsert a document based on its `_id`.
You can create a new document, `upsertDocument` will try to find if that `_id` already
exists and update that document, if not, then creates a new one.

```javascript
return startWith()
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(upsertDocument('contacts', { _id: uidToFind, name, last }, 'contact'))
```

## Error recovery, mostly for closing the connection

We usually need to close the connecting at the end of our functions pipeline.
If we have a `.catch(...)` step we should guarantee that once we process
the error we return the context so we can add another step at the end of
the promises chain to close the DB connection.

```javascript
return startWith()
    .then(connectMongoDB(process.env.MONGO_URL, process.env.MONGO_DB))
    .then(upsertDocument('contacts', { _id: uidToFind, name, last }, 'contact'))

    .catch(err => {
        // We process the error here

        return err.context
    })
    .then(closeMongoDB())
```

## Creating your own mongodb functions

You can use this approach to create your own mongodb functions. Your function
signature should look like this:

```javascript
const myMongoDBOp = (params) => ctx => {
    return ctx.mongodb.db.collection(...).op(...)
        .then(...) // mutates context if necessary

        .then(() => ctx) // return context at the end of the chain
        .catch(throwContextError(ctx))  // use throwContextError to wrap the error with the context
}
```



If you want to see a function included in here let me know by opening an issue.
