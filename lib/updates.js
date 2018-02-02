const { passData, throwContextError } = require('rvl-pipe')

const merge = (name, ctx) => data => {
  ctx[name] = data
  return ctx
}

module.exports.createDocument = (collectionName, document, name) => ctx => {
  const newData = passData(document, ctx)

  return ctx.mongodb.db.collection(collectionName)
    .insertOne(newData)
    .then(() => newData)
    .then(merge(name, ctx))
    .catch(throwContextError(ctx))
}

module.exports.upsertDocument = (collectionName, dataCreator, name) => ctx => {
  const storeData = passData(dataCreator, ctx)

  return ctx.mongodb.db.collection(collectionName)
    .replaceOne(
      { _id: storeData._id },
      storeData,
      { upsert: true }
    )
    .then(() => storeData)
    .then(merge(name, ctx))
    .catch(throwContextError(ctx))
}

module.exports.updateDocumentOne = (collectionName, filterCreator, dataCreator) => ctx => {
  const filter = passData(filterCreator, ctx)
  const storeData = passData(dataCreator, ctx)

  return ctx.mongodb.db.collection(collectionName)
    .updateOne(
      filter,
      storeData
    )
    .then(() => ctx)
    .catch(throwContextError(ctx))
}
