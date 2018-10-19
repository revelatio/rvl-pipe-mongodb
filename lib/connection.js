const MongoClient = require('mongodb')
const { iff, each, prop, noop } = require('rvl-pipe')

const createMongoDBConnection = (urlFn, dbNameFn, optionsFn) => ctx => MongoClient
  .connect(urlFn(ctx), optionsFn(ctx))
  .then(client => Object.assign(
      ctx,
      {
        mongodb: {
          client,
          db: client.db(dbNameFn(ctx))
        }
      }
    )
  )

module.exports.connectMongoDB = (mongoUrl, mongoDb, options) => each(
  iff(
    prop('mongodb'),
    noop(),
    createMongoDBConnection(mongoUrl, mongoDb, options)
  )
)

module.exports.closeMongoDB = () => ctx => {
  if (ctx && ctx.mongodb) {
    ctx.mongodb.client.close()
  }

  return ctx || {}
}
