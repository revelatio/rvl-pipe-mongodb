const MongoClient = require('mongodb')
const { iff, each, prop, not, throwContextError } = require('rvl-pipe')

const createMongoDBConnection = (url, dbName) => ctx => {
  return MongoClient.connect(url)
    .then(client => {
      ctx.mongodb = {
        client,
        db: client.db(dbName)
      }

      return ctx
    })
    .catch(throwContextError(ctx))
}

module.exports.connectMongoDB = (mongoUrl, mongoDb) => each(
  iff(
    not(prop('mongodb')),
    createMongoDBConnection(mongoUrl, mongoDb)
  )
)

module.exports.closeDB = () => ctx => {
  ctx.mongodb.client.close()
  return ctx
}
