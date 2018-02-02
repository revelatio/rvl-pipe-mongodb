const test = require('ava')
const { startWith, prop, props } = require('rvl-pipe')
const { connectMongoDB, upsertDocument } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')
const faker = require('faker')
const cuid = require('cuid')

test.serial('upsert one document with static data', t => {
  const { restore, collectionStub, replaceOneStub } = fakeMongo()
  const uid = cuid()
  const name = faker.name.findName()
  const email = faker.internet.email()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(upsertDocument('contacts', { _id: uid, name, email }))

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

  return startWith({
    contactId: uid,
    desiredName: name,
    desiredEmail: email
  })
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(upsertDocument(
      'contacts',
      props({
        _id: prop('contactId'),
        name: prop('desiredName'),
        email: prop('desiredEmail')
      })
    ))

    .then(() => {
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(replaceOneStub.args[0][0], { _id: uid })
      t.deepEqual(replaceOneStub.args[0][1], { _id: uid, name, email })
      t.deepEqual(replaceOneStub.args[0][2], { upsert: true })
      restore()
    })
})
