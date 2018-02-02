const test = require('ava')
const { startWith, should, prop } = require('rvl-pipe')
const { connectMongoDB } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')

test.serial('connects to DB', t => {
  const { connectStub, dbStub, restore } = fakeMongo()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(context => {
      t.truthy(context.mongodb)
      t.is(connectStub.args[0][0], 'fakeUrl')
      t.is(dbStub.args[0][0], 'fakeDB')

      restore()
    })
})

test.serial('should not attempt connect if there is already a mongodb object on context', t => {
  const { connectStub, dbStub, restore } = fakeMongo()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(should(prop('mongodb')))
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(context => {
      t.truthy(context.mongodb)
      t.is(connectStub.callCount, 1)
      t.is(dbStub.callCount, 1)

      restore()
    })
})
