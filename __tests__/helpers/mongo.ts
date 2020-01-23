import MongoClient from 'mongodb'
import sinon from 'sinon'
import cuid from 'cuid'
import faker from 'faker'

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

export const fakeCollections = { contact, contacts }

export const fakeMongo = (params?: any) => {
  const { count = 1, toArray = [] } = params || {}

  const replaceOneStub = sinon.stub().returns(Promise.resolve())
  const insertOneStub = sinon.stub().returns(Promise.resolve())
  const updateOneStub = sinon.stub().returns(Promise.resolve())
  const findOneStub = sinon.stub().returns(Promise.resolve(contact))
  const findStub = sinon.stub().returns({
    count: () => Promise.resolve(count),
    toArray: () => Promise.resolve(toArray)
  })
  const aggregateStub = sinon.stub().returns({
    count: () => Promise.resolve(count),
    toArray: () => Promise.resolve(toArray)
  })
  const collectionStub = sinon.stub().returns({
    findOne: findOneStub,
    find: findStub,
    aggregate: aggregateStub,
    insertOne: insertOneStub,
    updateOne: updateOneStub,
    replaceOne: replaceOneStub
  })
  const dbStub = sinon.stub().returns({
    collection: collectionStub
  })
  const closeStub = sinon.stub()

  const connectStubResult: any = Promise.resolve({
    db: dbStub,
    close: closeStub
  })

  const connectStub = sinon
    .stub(MongoClient, 'connect')
    .returns(connectStubResult)

  const restore = () => {
    connectStub.resetHistory()
    closeStub.resetHistory()
    dbStub.resetHistory()
    findStub.resetHistory()
    aggregateStub.resetHistory()
    findOneStub.resetHistory()
    insertOneStub.resetHistory()
    updateOneStub.resetHistory()
    replaceOneStub.resetHistory()
  }

  const finalRestore = () => {
    connectStub.restore()
  }

  return {
    dbStub,
    closeStub,
    connectStub,
    restore,
    finalRestore,
    findOneStub,
    collectionStub,
    findStub,
    insertOneStub,
    updateOneStub,
    replaceOneStub,
    aggregateStub
  }
}
