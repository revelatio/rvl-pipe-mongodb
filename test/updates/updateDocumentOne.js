const test = require('ava')
const { startWith, prop, props } = require('rvl-pipe')
const { connectMongoDB, updateDocumentOne } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')
const faker = require('faker')
const cuid = require('cuid')

test.serial('update one document with static filter and data', t => {
  const { restore, collectionStub, updateOneStub } = fakeMongo()
  const uid = cuid()
  const name = faker.name.findName()
  const email = faker.internet.email()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(updateDocumentOne('contacts', { _id: uid }, { $set: { name, email } }))

    .then(() => {
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(updateOneStub.args[0][0], { _id: uid })
      t.deepEqual(updateOneStub.args[0][1], { $set: { name, email } })
      restore()
    })
})

test.serial('update one document with dynamic filter and data', t => {
  const { restore, collectionStub, updateOneStub } = fakeMongo()
  const uid = cuid()
  const name = faker.name.findName()
  const email = faker.internet.email()

  return startWith({
    contactId: uid,
    desiredName: name,
    desiredEmail: email
  })
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(updateDocumentOne(
      'contacts',
      props({ _id: prop('contactId') }),
      props({ $set: { name: prop('desiredName'), email: prop('desiredEmail') } }))
    )

    .then(() => {
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(updateOneStub.args[0][0], { _id: uid })
      t.deepEqual(updateOneStub.args[0][1], { $set: { name, email } })
      restore()
    })
})
