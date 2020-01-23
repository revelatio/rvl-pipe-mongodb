import { each, prop, props, always } from 'rvl-pipe'
import { connectMongoDB, upsertDocument } from '../../src'
import { fakeMongo } from '../helpers/mongo'
import faker from 'faker'
import cuid from 'cuid'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('upsetDocument', () => {
  const { restore, finalRestore, collectionStub, replaceOneStub } = fakeMongo()

  afterEach(restore)

  afterAll(finalRestore)

  it('upsert one document with static data', () => {
    const uid = cuid()
    const name = faker.name.findName()
    const email = faker.internet.email()

    return each(
      connect,
      upsertDocument(
        'contacts',
        always({ _id: uid }),
        always({ _id: uid, name, email }),
        'contact'
      )
    )().then(() => {
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(replaceOneStub.args[0][0]).toEqual({ _id: uid })
      expect(replaceOneStub.args[0][1]).toEqual({ _id: uid, name, email })
      expect(replaceOneStub.args[0][2]).toEqual({ upsert: true })
    })
  })

  it('upsert one document with dynamic data', () => {
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
        }),
        'contact'
      )
    )({
      contactId: uid,
      desiredName: name,
      desiredEmail: email
    }).then(() => {
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(replaceOneStub.args[0][0]).toEqual({ _id: uid })
      expect(replaceOneStub.args[0][1]).toEqual({ _id: uid, name, email })
      expect(replaceOneStub.args[0][2]).toEqual({ upsert: true })
    })
  })
})
