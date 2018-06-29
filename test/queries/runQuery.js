const test = require('ava')
const { each, prop, props, always } = require('rvl-pipe')
const { connectMongoDB, runQuery } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

test.serial('queries one document with static filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
    runQuery('contacts', always({}), 'contactList')
  )()
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

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
    runQuery('contacts', props({ group: prop('selectedGroup') }), 'contactList')
  )({ selectedGroup: 'teamA' })
    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], { group: 'teamA' })
      restore()
    })
})
