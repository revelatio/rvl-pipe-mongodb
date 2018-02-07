const test = require('ava')
const { startWith } = require('rvl-pipe')
const { connectMongoDB, closeMongoDB } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')

test.serial('connects to DB', t => {
  const { restore, closeStub } = fakeMongo()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(ctx => {
      t.truthy(ctx.mongodb)
      return ctx
    })
    .then(closeMongoDB())
    .then(() => {
      t.is(closeStub.callCount, 1)
      restore()
    })
})

test.serial('connects to DB using empty object', t => {
  const { restore, closeStub } = fakeMongo()

  closeMongoDB()()
  t.is(closeStub.callCount, 0)
  restore()
})
