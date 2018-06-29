const test = require('ava')
const { each, prop, props, always } = require('rvl-pipe')
const { connectMongoDB, runQueryExists } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

test.serial('checks if document exists with static filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo()

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
    runQueryExists('contacts', always({ _id: fakeCollections.contact._id }), 'hasContact')
  )()
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

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
    runQueryExists('contacts', props({ _id: prop('contactId') }), 'hasContact')
  )({ contactId: fakeCollections.contact._id })

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

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
    runQueryExists('contacts', props({ _id: prop('contactId') }), 'hasContact')
  )({ contactId: fakeCollections.contact._id })
    .then(context => {
      t.true(context.hasOwnProperty('hasContact'))
      t.false(context.hasContact)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], { _id: fakeCollections.contact._id })
      restore()
    })
})
