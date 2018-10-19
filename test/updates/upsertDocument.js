const test = require('ava')
const { each, prop, props, always } = require('rvl-pipe')
const { connectMongoDB, upsertDocument } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')
const faker = require('faker')
const cuid = require('cuid')

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

test.serial('upsert one document with static data', t => {
  const { restore, collectionStub, replaceOneStub } = fakeMongo()
  const uid = cuid()
  const name = faker.name.findName()
  const email = faker.internet.email()

  return each(
    connect,
    upsertDocument('contacts', always({ _id: uid }), always({ _id: uid, name, email }))
  )()
    .then(() => {
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(replaceOneStub.args[0][0], { _id: uid })
      t.deepEqual(replaceOneStub.args[0][1], { _id: uid, name, email })
      t.deepEqual(replaceOneStub.args[0][2], { upsert: true })
      restore()
    })
})

test.serial('upsert one document with dynamic data', t => {
  const { restore, collectionStub, replaceOneStub } = fakeMongo()
  const uid = cuid()
  const name = faker.name.findName()
  const email = faker.internet.email()

  return each(
    connect,
    upsertDocument(
      'contacts',
      props({
        _id: prop('contactId')
      }),
      props({
        _id: prop('contactId'),
        name: prop('desiredName'),
        email: prop('desiredEmail')
      })
    )
  )({
    contactId: uid,
    desiredName: name,
    desiredEmail: email
  })
    .then(() => {
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(replaceOneStub.args[0][0], { _id: uid })
      t.deepEqual(replaceOneStub.args[0][1], { _id: uid, name, email })
      t.deepEqual(replaceOneStub.args[0][2], { upsert: true })
      restore()
    })
})
