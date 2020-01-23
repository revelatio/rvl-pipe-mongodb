import { each, prop, props, always } from 'rvl-pipe'
import { connectMongoDB, updateDocumentOne } from '../../src'
import { fakeMongo } from '../helpers/mongo'
import faker from 'faker'
import cuid from 'cuid'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('updateDocumentOne', () => {
  const { restore, finalRestore, collectionStub, updateOneStub } = fakeMongo()

  afterEach(restore)

  afterAll(finalRestore)

  it('update one document with static filter and data', () => {
    const uid = cuid()
    const name = faker.name.findName()
    const email = faker.internet.email()

    return each(
      connect,
      updateDocumentOne(
        'contacts',
        always({ _id: uid }),
        always({ $set: { name, email } })
      )
    )().then(() => {
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(updateOneStub.args[0][0]).toEqual({ _id: uid })
      expect(updateOneStub.args[0][1]).toEqual({ $set: { name, email } })
    })
  })

  it('update one document with dynamic filter and data', () => {
    const uid = cuid()
    const name = faker.name.findName()
    const email = faker.internet.email()

    return each(
      connect,
      updateDocumentOne(
        'contacts',
        props({ _id: prop('contactId') }),
        props({
          $set: { name: prop('desiredName'), email: prop('desiredEmail') }
        })
      )
    )({
      contactId: uid,
      desiredName: name,
      desiredEmail: email
    }).then(() => {
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(updateOneStub.args[0][0]).toEqual({ _id: uid })
      expect(updateOneStub.args[0][1]).toEqual({ $set: { name, email } })
    })
  })
})
