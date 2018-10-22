const { merge } = require('./helpers')

module.exports.runQuery = (collectionName, filter, name, options) => ctx => {
  return ctx.mongodb.db.collection(collectionName)
    .find(filter(ctx), (options && options(ctx)) || undefined)
    .toArray()
    .then(merge(name, ctx))
}

module.exports.runQueryCount = (collectionName, filter, name) => ctx => {
  return ctx.mongodb.db.collection(collectionName)
    .find(filter(ctx))
    .count()
    .then(merge(name, ctx))
}

module.exports.runQueryOne = (collectionName, filter, name, options) => ctx => {
  return ctx.mongodb.db.collection(collectionName)
    .findOne(filter(ctx), (options && options(ctx)) || undefined)
    .then(merge(name, ctx))
}

module.exports.runQueryExists = (collectionName, filter, name) => ctx => {
  return ctx.mongodb.db.collection(collectionName)
    .find(filter(ctx)).count()
    .then(count => count > 0)
    .then(merge(name, ctx))
}
