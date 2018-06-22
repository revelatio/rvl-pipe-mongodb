const test = require('ava')
const { each, should, prop } = require('rvl-pipe')
const { connectMongoDB } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')

test.serial('connects to DB', t => {
  const { connectStub, dbStub, restore } = fakeMongo()

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
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
    connectMongoDB('fakeUrl', 'fakeDB'),
    should(prop('mongodb')),
    connectMongoDB('fakeUrl', 'fakeDB'),
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

  return connectMongoDB('fakeUrl', 'fakeDB')()
    .then(context => {
      t.truthy(context.mongodb)
      t.is(connectStub.args[0][0], 'fakeUrl')
      t.is(dbStub.args[0][0], 'fakeDB')

      restore()
    })
})
