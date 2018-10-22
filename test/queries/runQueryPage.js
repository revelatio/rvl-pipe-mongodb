const test = require('ava')
const { each, always } = require('rvl-pipe')
const { connectMongoDB, runQueryPage } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

test.serial('queries one document with static filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return each(
    connect,
    runQueryPage('contacts', always({}), 'contactList', always(2), always(3))
  )()
    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], {})
      t.is(findStub.args[1][0], 2)
      t.is(findStub.args[2][0], 3)
      restore()
    })
})

test.serial('queries one document with projection', t => {
  const { restore, collectionStub, findStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return each(
    connect,
    runQueryPage('contacts', always({}), 'contactList', always(2), always(3), always({ name: 1, email: 1 }))
  )()
    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], {})
      t.deepEqual(findStub.args[0][1], { name: 1, email: 1 })
      t.is(findStub.args[1][0], 2)
      t.is(findStub.args[2][0], 3)
      restore()
    })
})
