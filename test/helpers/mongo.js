const MongoClient = require('mongodb')
const sinon = require('sinon')
const cuid = require('cuid')
const faker = require('faker')

const contact = {
  _id: cuid(),
  name: faker.name.findName(),
  email: faker.internet.email()
}

const contacts = [
  { _id: cuid(), name: faker.name.findName(), email: faker.internet.email() },
  { _id: cuid(), name: faker.name.findName(), email: faker.internet.email() },
  { _id: cuid(), name: faker.name.findName(), email: faker.internet.email() },
  { _id: cuid(), name: faker.name.findName(), email: faker.internet.email() }
]

module.exports.fakeCollections = { contact, contacts }

module.exports.fakeMongo = params => {
  const { count = 1, toArray = [] } = params || {}

  const replaceOneStub = sinon.stub().returns(Promise.resolve())
  const insertOneStub = sinon.stub().returns(Promise.resolve())
  const updateOneStub = sinon.stub().returns(Promise.resolve())
  const findOneStub = sinon.stub().returns(Promise.resolve(contact))
  const findStub = sinon.stub().returns({
    count: () => Promise.resolve(count),
    toArray: () => Promise.resolve(toArray)
  })
  const collectionStub = sinon.stub().returns({
    findOne: findOneStub,
    find: findStub,
    insertOne: insertOneStub,
    updateOne: updateOneStub,
    replaceOne: replaceOneStub
  })
  const dbStub = sinon.stub().returns({
    collection: collectionStub
  })
  const closeStub = sinon.stub()

  const connectStub = sinon.stub(MongoClient, 'connect').returns(
    Promise.resolve({
      db: dbStub,
      close: closeStub
    })
  )

  const restore = () => connectStub.restore()

  return {
    dbStub,
    closeStub,
    connectStub,
    restore,
    findOneStub,
    collectionStub,
    findStub,
    insertOneStub,
    updateOneStub,
    replaceOneStub
  }
}
