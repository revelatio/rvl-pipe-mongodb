const test = require('ava')
const { startWith, prop, props } = require('rvl-pipe')
const { connectMongoDB, runQuery } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

test.serial('queries one document with static filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(runQuery('contacts', {}, 'contactList'))

    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], {})
      restore()
    })
})

test.serial('queries one document with dynamic filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return startWith({ selectedGroup: 'teamA' })
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(runQuery('contacts', props({ group: prop('selectedGroup') }), 'contactList'))

    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], { group: 'teamA' })
      restore()
    })
})
