const test = require('ava')
const { startWith, prop, props } = require('rvl-pipe')
const { connectMongoDB, runQueryOne } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

test.serial('queries one document with static filter', t => {
  const { restore, collectionStub, findOneStub } = fakeMongo()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(runQueryOne('contacts', { _id: fakeCollections.contact._id }, 'contact'))

    .then(context => {
      t.truthy(context.contact)
      t.deepEqual(context.contact, fakeCollections.contact)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findOneStub.args[0][0], { _id: fakeCollections.contact._id })
      restore()
    })
})

test.serial('queries one document with dynamic filter', t => {
  const { restore, collectionStub, findOneStub } = fakeMongo()

  return startWith({ contactId: fakeCollections.contact._id })
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(runQueryOne('contacts', props({ _id: prop('contactId') }), 'contact'))

    .then(context => {
      t.truthy(context.contact)
      t.deepEqual(context.contact, fakeCollections.contact)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findOneStub.args[0][0], { _id: fakeCollections.contact._id })
      restore()
    })
})
