const test = require('ava')
const { startWith, prop, props } = require('rvl-pipe')
const { connectMongoDB, runQueryExists } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

test.serial('checks if document exists with static filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(runQueryExists('contacts', { _id: fakeCollections.contact._id }, 'hasContact'))

    .then(context => {
      t.true(context.hasOwnProperty('hasContact'))
      t.true(context.hasContact)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], { _id: fakeCollections.contact._id })
      restore()
    })
})

test.serial('checks if document exists with dynamic filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo()

  return startWith({ contactId: fakeCollections.contact._id })
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(runQueryExists('contacts', props({ _id: prop('contactId') }), 'hasContact'))

    .then(context => {
      t.true(context.hasOwnProperty('hasContact'))
      t.true(context.hasContact)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], { _id: fakeCollections.contact._id })
      restore()
    })
})

test.serial('document does not exists with dynamic filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo({ count: 0 })

  return startWith({ contactId: fakeCollections.contact._id })
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(runQueryExists('contacts', props({ _id: prop('contactId') }), 'hasContact'))

    .then(context => {
      t.true(context.hasOwnProperty('hasContact'))
      t.false(context.hasContact)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], { _id: fakeCollections.contact._id })
      restore()
    })
})
