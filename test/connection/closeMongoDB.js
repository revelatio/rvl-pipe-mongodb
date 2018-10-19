const test = require('ava')
const { each, always } = require('rvl-pipe')
const { connectMongoDB, closeMongoDB } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

test.serial('connects to DB', t => {
  const { restore, closeStub } = fakeMongo()

  return each(
    connect,
    ctx => {
      t.truthy(ctx.mongodb)
      return ctx
    },
    closeMongoDB(),
    () => {
      t.is(closeStub.callCount, 1)
      restore()
    }
  )()
})

test.serial('connects to DB using empty object', t => {
  const { restore, closeStub } = fakeMongo()

  closeMongoDB()()
  t.is(closeStub.callCount, 0)
  restore()
})
