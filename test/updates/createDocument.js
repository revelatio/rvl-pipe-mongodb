const test = require('ava')
const { startWith, prop, props } = require('rvl-pipe')
const { connectMongoDB, createDocument } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')
const faker = require('faker')
const cuid = require('cuid')

test.serial('creates one document with static data', t => {
  const { restore, collectionStub, insertOneStub } = fakeMongo()
  const uid = cuid()
  const name = faker.name.findName()
  const email = faker.internet.email()

  return startWith()
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(createDocument('contacts', { _id: uid, name, email }, 'newContact'))

    .then(context => {
      t.truthy(context.newContact)
      t.deepEqual(context.newContact, { _id: uid, name, email })
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(insertOneStub.args[0][0], { _id: uid, name, email })
      restore()
    })
})

test.serial('creates one document with dynamic data', t => {
  const { restore, collectionStub, insertOneStub } = fakeMongo()
  const uid = cuid()
  const name = faker.name.findName()
  const email = faker.internet.email()

  return startWith({ contact: { name, email } })
    .then(connectMongoDB('fakeUrl', 'fakeDB'))
    .then(createDocument('contacts', props({ _id: uid, name: prop('contact.name'), email: prop('contact.email') }), 'newContact'))

    .then(context => {
      t.truthy(context.newContact)
      t.deepEqual(context.newContact, { _id: uid, name, email })
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(insertOneStub.args[0][0], { _id: uid, name, email })
      restore()
    })
})
