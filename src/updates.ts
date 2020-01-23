import { merge } from './helper'
import { SyncFunction, AsyncFunction, Context } from 'rvl-pipe'

export const createDocument = (
  collectionName: string,
  document: SyncFunction,
  name: string
): AsyncFunction => (ctx: Context) => {
  const newData = document(ctx)

  return ctx.mongodb.db
    .collection(collectionName)
    .insertOne(newData)
    .then(() => newData)
    .then(merge(name, ctx))
}

export const upsertDocument = (
  collectionName: string,
  filter: SyncFunction,
  dataCreator: SyncFunction,
  name: string
): AsyncFunction => (ctx: Context) => {
  const storeData = dataCreator(ctx)

  return ctx.mongodb.db
    .collection(collectionName)
    .replaceOne(filter(ctx), storeData, { upsert: true })
    .then(() => storeData)
    .then(merge(name, ctx))
}

export const updateDocumentOne = (
  collectionName: string,
  filterCreator: SyncFunction,
  dataCreator: SyncFunction
): AsyncFunction => (ctx: Context) => {
  const filter = filterCreator(ctx)
  const storeData = dataCreator(ctx)

  return ctx.mongodb.db
    .collection(collectionName)
    .updateOne(filter, storeData)
    .then(() => ctx)
}
