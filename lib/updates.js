const { merge } = require('./helpers')

module.exports.createDocument = (collectionName, document, name) => ctx => {
  const newData = document(ctx)

  return ctx.mongodb.db.collection(collectionName)
    .insertOne(newData)
    .then(() => newData)
    .then(merge(name, ctx))
}

module.exports.upsertDocument = (collectionName, filter, dataCreator, name) => ctx => {
  const storeData = dataCreator(ctx)

  return ctx.mongodb.db.collection(collectionName)
    .replaceOne(
      filter(ctx),
      storeData,
      { upsert: true }
    )
    .then(() => storeData)
    .then(merge(name, ctx))
}

module.exports.updateDocumentOne = (collectionName, filterCreator, dataCreator) => ctx => {
  const filter = filterCreator(ctx)
  const storeData = dataCreator(ctx)

  return ctx.mongodb.db.collection(collectionName)
    .updateOne(
      filter,
      storeData
    )
    .then(() => ctx)
}
