const test = require('ava')
const { each, prop, props, always } = require('rvl-pipe')
const { connectMongoDB, updateDocumentOne } = require('../../index')
const { fakeMongo } = require('../helpers/mongo')
const faker = require('faker')
const cuid = require('cuid')

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

test.serial('update one document with static filter and data', t => {
  const { restore, collectionStub, updateOneStub } = fakeMongo()
  const uid = cuid()
  const name = faker.name.findName()
  const email = faker.internet.email()

  return each(
    connect,
    updateDocumentOne('contacts', always({ _id: uid }), always({ $set: { name, email } }))
  )()
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

  return each(
    connect,
    updateDocumentOne(
      'contacts',
      props({ _id: prop('contactId') }),
      props({ $set: { name: prop('desiredName'), email: prop('desiredEmail') } })
    )
  )({
    contactId: uid,
    desiredName: name,
    desiredEmail: email
  })
    .then(() => {
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(updateOneStub.args[0][0], { _id: uid })
      t.deepEqual(updateOneStub.args[0][1], { $set: { name, email } })
      restore()
    })
})
