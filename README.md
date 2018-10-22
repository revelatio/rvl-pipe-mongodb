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
    if (someError) {
        return Promise.reject(error)
    }

    return Promise.resolve(context)
}
```

For Mongodb the set of functions are of 3 types: connection, query and updates.

## Connection

- `connectMongoDB(urlFn, dbNameFn, optionsFn)`: Creates a connection step,
You need to pass url, dbName and connection options as functions that pull the
right information from the context or simply use a constant function (like always)
Only runs once. So you can use the same step several times without actually
attempting the connection process. It will add a `mongodb` property to the context.

```javascript
return each(
    connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
    should(prop('mongodb'), 'NoMongoDBConnection')
)()
```

- `closeMongoDB()`: Closes the DB connection that exists on the context.

```javascript
return each(
    connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
    // Do some DB operations
    closeMongoDB()
)()
```

To handle connection errors is best to wrap your functions with the `ensure` function from `rvl-pipe`:

```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        // Do some DB operations
        // ...
    ),
    closeMongoDB()
)()
```

## Queries

- `runQueryOne(collection, filterFn, propName, projectionFn?)`: Performs a simple `findOne` query. We need to especify, collection, filter, property name to store value and projection to define the props we want to retrieve. the `projectioFn` params in not mandatory, if not provided all props will be retrieved.

```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        runQueryOne('contacts', always({ _id: uidToFind }), 'foundContact'),
        should(prop('foundContact'), 'ContactNotFound')
        runQueryOne('users', prop({ id: prop('foundContant.id') }), 'user', always({ email: 1 })) // Only retrieves email
    ),
    closeMongoDB()
)()
```


You can also use dynamic data for the filter

```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        runQueryOne('contacts', props({ _id: prop('contactId') }), 'foundContact'),
        should(prop('foundContact'), 'ContactNotFound')
    ),
    closeMongoDB()
)({ contactId: '209889833' })
```

- `runQuery(collection, filterFn, propName, projectionFn?)`: Similar to `runQueryOne` but returning all resulting documents. (This function is not designed to be
performant in terms of memory consumption since it uses the `toArray()` on the resulting `find` cursor.


```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        runQuery('projects', props({ owner: prop('owner') }), 'ownerProjects'),
        should(prop('ownerProjects'), 'ProjectsNotFound')
    ),
    closeMongoDB()
)({ owner: '209889833' })
```

- `runQueryPage(collection, filterFn, propName, skipFn, limitFn, projectionFn?)`: Similar to `runQuery` with added support for `skip` and `limit` via functions.


```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        runQueryPage(
            'projects',
            props({ owner: prop('owner') }),
            'ownerProjects',
            always(0), // Skip
            always(10) // Limit
        ),
        should(prop('ownerProjects'), 'ProjectsNotFound')
    ),
    closeMongoDB()
)({ owner: '209889833' })
```


- `runQueryExists(collection, filterFn, propName)`: Exactly as `runQueryOne` but will return **true** | **false**
if the document exists on the DB

```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        runQueryExists('contacts', always({ _id: uidToFind }), 'foundContact'),
        should(prop('foundContact'), 'ContactNotFound')
    ),
    closeMongoDB()
)()
```

- `runQueryCount(collection, filterFn, propName)`: Exactly as `runQueryExists` but will return how many documents match on the DB

```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        runQueryCount('contacts', always({ _id: uidToFind }), 'contactCount'),
        should(
            equal(
                prop('contactCount'),
                always(2)
            ),
            'ContactCountDiffersFromTwo'
        )
    ),
    closeMongoDB()
)()
```


## Creating and Updating documents

- `createDocument(collection, dataFn, propName)`: Creates a simple document passing the collection and the data for it.

```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        createDocument('contacts', always({ _id: cuid(), name: 'John', last: 'Doe' }), 'newContact'),
        should(prop('newContact'), 'ContactNotCreated')
    ),
    closeMongoDB()
)()
```

- `updateDocumentOne(collection, filterFn, modificationFn)`: Updates one document passing the collection, the filter to
find the document we want to change and the modification object.

```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        updateDocumentOne('contacts', always({ _id: uidToChange }), always({ $set: { name: 'Mary' } }))
    ),
    closeMongoDB()
)()
```

- `upsertDocument(collection, filterFn, dataFn, propName)`: This function will create a step to upsert a document based on a filter function.
You can create a new document, `upsertDocument` will try to find if that document already
exists and update that document, if not, then creates a new one.

```javascript
return ensure(
    each(
        connectMongoDB(always(process.env.MONGO_URL), always(process.env.MONGO_DB), always({...})),
        upsertDocument('contacts', always({ _id: uidToFind }), always({ _id: uidToFind, name, last }), 'contact')
    ),
    closeMongoDB()
)()
```

## Creating your own mongodb functions

You can use this approach to create your own mongodb functions. Your function
signature should look like this:

```javascript
const myMongoDBOp = (params) => ctx => {
    return ctx.mongodb.db.collection(...).op(...)
        .then(...) // mutates context if necessary

        .then(() => ctx) // return context at the end of the chain
}
```

If you want to see a function included in here let me know by opening an issue.
