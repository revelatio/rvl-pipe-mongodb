import { each, prop, props, always } from 'rvl-pipe'
import { connectMongoDB, runQueryExists } from '../../src'
import { fakeMongo, fakeCollections } from '../helpers/mongo'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('runQueryExists', () => {
  const { restore, finalRestore, collectionStub, findStub } = fakeMongo()

  afterEach(restore)

  afterAll(finalRestore)

  it('checks if document exists with static filter', () => {
    return each(
      connect,
      runQueryExists(
        'contacts',
        always({ _id: fakeCollections.contact._id }),
        'hasContact'
      )
    )().then(context => {
      expect(context.hasOwnProperty('hasContact')).toBe(true)
      expect(context.hasContact).toBe(true)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findStub.args[0][0]).toEqual({ _id: fakeCollections.contact._id })
    })
  })

  it('checks if document exists with dynamic filter', () => {
    return each(
      connect,
      runQueryExists(
        'contacts',
        props({ _id: prop('contactId') }),
        'hasContact'
      )
    )({ contactId: fakeCollections.contact._id }).then(context => {
      expect(context.hasOwnProperty('hasContact')).toBe(true)
      expect(context.hasContact).toBe(true)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findStub.args[0][0]).toEqual({ _id: fakeCollections.contact._id })
    })
  })

  it('document does not exists with dynamic filter', () => {
    return each(
      connect,
      runQueryExists(
        'contacts',
        props({ _id: prop('contactId') }),
        'hasContact'
      )
    )({ contactId: fakeCollections.contact._id }).then(context => {
      expect(context.hasOwnProperty('hasContact')).toBe(true)
      expect(context.hasContact).toBe(true)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findStub.args[0][0]).toEqual({ _id: fakeCollections.contact._id })
    })
  })
})
