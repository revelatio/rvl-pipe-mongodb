const MongoClient = require('mongodb')
const sinon = require('sinon')
const Promise = require('bluebird')
const cuid = require('cuid')
const faker = require('faker')

const contact = {
  _id: cuid(),
  name: faker.name.findName(),
  email: faker.internet.email()
}

module.exports.fakeCollections = collections

module.exports.fakeMongo = () => {
  const findOneStub = sinon.stub().returns(Promise.resolve(contact))

  const collectionStub = sinon.sub().returns({
    findOne: findOneStub
  })
  const dbStub = sinon.stub().returns({
    collection: collectionStub
  })
  const closeStub = sinon.stub()

  const connectStub = sinon
    .stub(MongoClient, 'connect')
    .returns(Promise.resolve({
      db: dbStub,
      close: closeStub
    }))

  const restore = () => connectStub.restore()

  return {
    dbStub, closeStub, connectStub, restore, findOneStub
  }
}
