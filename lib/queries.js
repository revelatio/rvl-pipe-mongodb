const { passData, throwContextError } = require('rvl-pipe')

const merge = (name, ctx) => data => {
  ctx[name] = data
  return ctx
}

module.exports.runQuery = (collectionName, filter, name) => ctx => {
  return ctx.mongodb.db.collection(collectionName)
    .find(passData(filter, ctx)).toArray()
    .then(merge(name, ctx))
    .catch(throwContextError(ctx))
}

module.exports.runQueryOne = (collectionName, filter, name) => ctx => {
  return ctx.mongodb.db.collection(collectionName)
    .findOne(passData(filter, ctx))
    .then(merge(name, ctx))
    .catch(throwContextError(ctx))
}

module.exports.runQueryExists = (collectionName, filter, name) => ctx => {
  return ctx.mongodb.db.collection(collectionName)
    .find(passData(filter, ctx)).count()
    .then(count => count > 0)
    .then(merge(name, ctx))
    .catch(throwContextError(ctx))
}
