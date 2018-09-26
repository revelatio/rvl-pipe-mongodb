const MongoClient = require('mongodb')
const { iff, each, prop, noop } = require('rvl-pipe')

const createMongoDBConnection = (url, dbName) => ctx => MongoClient
  .connect(url, { useNewUrlParser: true })
  .then(client => Object.assign(
      ctx,
    {
      mongodb: {
        client,
        db: client.db(dbName)
      }
    }
    )
  )

module.exports.connectMongoDB = (mongoUrl, mongoDb) => each(
  iff(
    prop('mongodb'),
    noop(),
    createMongoDBConnection(mongoUrl, mongoDb)
  )
)

module.exports.closeMongoDB = () => ctx => {
  if (ctx && ctx.mongodb) {
    ctx.mongodb.client.close()
  }

  return ctx || {}
}
