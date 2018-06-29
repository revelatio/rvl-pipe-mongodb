const test = require('ava')
const { each, prop, props, always } = require('rvl-pipe')
const { connectMongoDB, runQueryOne } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

test.serial('queries one document with static filter', t => {
  const { restore, collectionStub, findOneStub } = fakeMongo()

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
    runQueryOne('contacts', always({ _id: fakeCollections.contact._id }), 'contact')
  )()
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

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
    runQueryOne('contacts', props({ _id: prop('contactId') }), 'contact')
  )({ contactId: fakeCollections.contact._id })
    .then(context => {
      t.truthy(context.contact)
      t.deepEqual(context.contact, fakeCollections.contact)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findOneStub.args[0][0], { _id: fakeCollections.contact._id })
      restore()
    })
})
