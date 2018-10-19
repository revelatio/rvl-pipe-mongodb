const test = require('ava')
const { each, should, prop, always } = require('rvl-pipe')
const { connectMongoDB } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

test.serial('connects to DB', t => {
  const { connectStub, dbStub, restore } = fakeMongo()

  return each(
    connect,
    context => {
      t.truthy(context.mongodb)
      t.is(connectStub.args[0][0], 'fakeUrl')
      t.is(dbStub.args[0][0], 'fakeDB')

      restore()
    }
  )()
})

test.serial('should not attempt connect if there is already a mongodb object on context', t => {
  const { connectStub, dbStub, restore } = fakeMongo()

  return each(
    connect,
    should(prop('mongodb')),
    connect,
    context => {
      t.truthy(context.mongodb)
      t.is(connectStub.callCount, 1)
      t.is(dbStub.callCount, 1)

      restore()
    }
  )()
})

test.serial('connects to DB using empty object', t => {
  const { connectStub, dbStub, restore } = fakeMongo()

  return connect()
    .then(context => {
      t.truthy(context.mongodb)
      t.is(connectStub.args[0][0], 'fakeUrl')
      t.is(dbStub.args[0][0], 'fakeDB')

      restore()
    })
})
