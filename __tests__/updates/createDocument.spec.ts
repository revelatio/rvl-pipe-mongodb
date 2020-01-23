import { each, prop, props, always } from 'rvl-pipe'
import { connectMongoDB, createDocument } from '../../src'
import { fakeMongo } from '../helpers/mongo'
import faker from 'faker'
import cuid from 'cuid'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('createDocument', () => {
  const { restore, finalRestore, collectionStub, insertOneStub } = fakeMongo()

  afterEach(restore)

  afterAll(finalRestore)

  it('creates one document with static data', () => {
    const uid = cuid()
    const name = faker.name.findName()
    const email = faker.internet.email()

    return each(
      connect,
      createDocument(
        'contacts',
        always({ _id: uid, name, email }),
        'newContact'
      )
    )().then(context => {
      expect(context.newContact).toBeTruthy()
      expect(context.newContact).toEqual({ _id: uid, name, email })
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(insertOneStub.args[0][0]).toEqual({ _id: uid, name, email })
    })
  })

  it('creates one document with dynamic data', () => {
    const uid = cuid()
    const name = faker.name.findName()
    const email = faker.internet.email()

    return each(
      connect,
      createDocument(
        'contacts',
        props({
          _id: uid,
          name: prop('contact.name'),
          email: prop('contact.email')
        }),
        'newContact'
      )
    )({ contact: { name, email } }).then(context => {
      expect(context.newContact).toBeTruthy()
      expect(context.newContact).toEqual({ _id: uid, name, email })
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(insertOneStub.args[0][0]).toEqual({ _id: uid, name, email })
    })
  })
})
