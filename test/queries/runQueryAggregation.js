const test = require('ava')
const { each, prop, props, always } = require('rvl-pipe')
const { connectMongoDB, runQueryAggregation } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

test.serial('queries one document with static filter', t => {
  const { restore, collectionStub, aggregateStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return each(
    connect,
    runQueryAggregation('contacts', [always({})], 'contactList')
  )()
    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(aggregateStub.args[0][0], [{}])
      restore()
    })
})

test.serial('queries one document with options', t => {
  const { restore, collectionStub, aggregateStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return each(
    connect,
    runQueryAggregation('contacts', [always({})], 'contactList', always({ option: { key: 'value' } }))
  )()
    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(aggregateStub.args[0][0], [{}])
      t.deepEqual(aggregateStub.args[0][1], { option: { key: 'value' } })
      restore()
    })
})

test.serial('queries one document with dynamic filter', t => {
  const { restore, collectionStub, aggregateStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return each(
    connect,
    runQueryAggregation('contacts', [props({ group: prop('selectedGroup') })], 'contactList')
  )({ selectedGroup: 'teamA' })
    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(aggregateStub.args[0][0], [{ group: 'teamA' }])
      restore()
    })
})
