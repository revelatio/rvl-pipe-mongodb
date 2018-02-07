const MongoClient = require('mongodb')
const { iff, each, prop, not, throwContextError } = require('rvl-pipe')
const R = require('ramda')

const createMongoDBConnection = (url, dbName) => ctx => {
  return MongoClient.connect(url)
    .then(client => {
      return R.merge(
        ctx || {},
        {
          mongodb: {
            client,
            db: client.db(dbName)
          }
        }
      )
    })
    .catch(throwContextError(ctx))
}

module.exports.connectMongoDB = (mongoUrl, mongoDb) => each(
  iff(
    not(prop('mongodb')),
    createMongoDBConnection(mongoUrl, mongoDb)
  )
)

module.exports.closeMongoDB = () => ctx => {
  if (ctx && ctx.mongodb) {
    ctx.mongodb.client.close()
  }

  return ctx || {}
}
