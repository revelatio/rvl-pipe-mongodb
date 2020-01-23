import MongoClient from 'mongodb'
import { Context, AsyncFunction, SyncFunction } from 'rvl-pipe'

export const connectMongoDB = (
  mongoUrl: SyncFunction,
  mongoDb: SyncFunction,
  options?: SyncFunction
): AsyncFunction => (ctx: Context) => {
  if (!ctx.mongodb) {
    return MongoClient.connect(
      mongoUrl(ctx),
      (options && options(ctx)) || undefined
    ).then(client =>
      Promise.resolve({
        ...ctx,
        mongodb: {
          client,
          db: client.db(mongoDb(ctx))
        }
      })
    )
  }

  return Promise.resolve(ctx)
}

export const closeMongoDB = (): AsyncFunction => (ctx: Context) => {
  if (ctx.mongodb) {
    ctx.mongodb.client.close()
  }

  return Promise.resolve(ctx)
}
