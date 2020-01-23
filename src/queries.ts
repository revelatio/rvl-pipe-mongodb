import { SyncFunction, AsyncFunction, Context } from 'rvl-pipe'
import { merge } from './helper'

export const runQuery = (
  collectionName: string,
  filter: SyncFunction,
  name: string,
  options?: SyncFunction
): AsyncFunction => (ctx: Context) => {
  return ctx.mongodb.db
    .collection(collectionName)
    .find(filter(ctx), (options && options(ctx)) || undefined)
    .toArray()
    .then(merge(name, ctx))
}

export const runQueryAggregation = (
  collectionName: string,
  pipelineFns: SyncFunction[],
  name: string,
  options?: SyncFunction
): AsyncFunction => (ctx: Context) => {
  return ctx.mongodb.db
    .collection(collectionName)
    .aggregate(
      pipelineFns.map(pipelineFn => pipelineFn(ctx)),
      (options && options(ctx)) || undefined
    )
    .toArray()
    .then(merge(name, ctx))
}

export const runQueryCount = (
  collectionName: string,
  filter: SyncFunction,
  name: string
): AsyncFunction => (ctx: Context) => {
  return ctx.mongodb.db
    .collection(collectionName)
    .find(filter(ctx))
    .count()
    .then(merge(name, ctx))
}

export const runQueryOne = (
  collectionName: string,
  filter: SyncFunction,
  name: string,
  options?: SyncFunction
): AsyncFunction => (ctx: Context) => {
  return ctx.mongodb.db
    .collection(collectionName)
    .findOne(filter(ctx), (options && options(ctx)) || undefined)
    .then(merge(name, ctx))
}

export const runQueryExists = (
  collectionName: string,
  filter: SyncFunction,
  name: string
): AsyncFunction => (ctx: Context) => {
  return ctx.mongodb.db
    .collection(collectionName)
    .find(filter(ctx))
    .count()
    .then((count: number) => count > 0)
    .then(merge(name, ctx))
}
