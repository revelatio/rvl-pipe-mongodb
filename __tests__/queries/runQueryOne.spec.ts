import { each, prop, props, always } from 'rvl-pipe'
import { connectMongoDB, runQueryOne } from '../../src'
import { fakeMongo, fakeCollections } from '../helpers/mongo'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('runQueryOne', () => {
  const { restore, finalRestore, collectionStub, findOneStub } = fakeMongo()

  afterEach(restore)

  afterAll(finalRestore)

  it('queries one document with static filter', () => {
    return each(
      connect,
      runQueryOne(
        'contacts',
        always({ _id: fakeCollections.contact._id }),
        'contact'
      )
    )().then(context => {
      expect(context.contact).toBeTruthy()
      expect(context.contact).toEqual(fakeCollections.contact)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findOneStub.args[0][0]).toEqual({
        _id: fakeCollections.contact._id
      })
    })
  })

  it('queries one document with options', () => {
    return each(
      connect,
      runQueryOne(
        'contacts',
        always({ _id: fakeCollections.contact._id }),
        'contact',
        always({ projection: { name: 1, email: 1 } })
      )
    )().then(context => {
      expect(context.contact).toBeTruthy()
      expect(context.contact).toEqual(fakeCollections.contact)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findOneStub.args[0][0]).toEqual({
        _id: fakeCollections.contact._id
      })
      expect(findOneStub.args[0][1]).toEqual({
        projection: { name: 1, email: 1 }
      })
    })
  })

  it('queries one document with dynamic filter', () => {
    return each(
      connect,
      runQueryOne('contacts', props({ _id: prop('contactId') }), 'contact')
    )({ contactId: fakeCollections.contact._id }).then(context => {
      expect(context.contact).toBeTruthy()
      expect(context.contact).toEqual(fakeCollections.contact)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findOneStub.args[0][0]).toEqual({
        _id: fakeCollections.contact._id
      })
    })
  })
})
