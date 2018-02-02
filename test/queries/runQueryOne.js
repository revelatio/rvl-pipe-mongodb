const test = require('ava')
const { startWith, should, prop } = require('rvl-pipe')
const { connectMongoDB, runQueryOne } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')


test.serial('queries one document with static filter', t => {
  const { connectStub, dbStub, restore } = fakeMongo()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(runQueryOne('contacts', { _id: fakeCollections[0]._id }, 'contact'))

    .then(context => {
      t.truthy(context.mongodb)
      t.is(connectStub.args[0][0], 'fakeUrl')
      t.is(dbStub.args[0][0], 'fakeDB')

      restore()
    })
})
