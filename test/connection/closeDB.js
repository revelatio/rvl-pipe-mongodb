const test = require('ava')
const { startWith } = require('rvl-pipe')
const { connectMongoDB, closeDB } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')

test('connects to DB', t => {
  const { restore, closeStub } = fakeMongo()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(ctx => {
      t.truthy(ctx.mongodb)
      return ctx
    })
    .then(closeDB())
    .then(ctx => {
      t.is(closeStub.callCount, 1)
      restore()
    })
})
