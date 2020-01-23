import { each, prop, props, always } from 'rvl-pipe'
import { connectMongoDB, runQuery } from '../../src'
import { fakeMongo, fakeCollections } from '../helpers/mongo'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('runQuery', () => {
  const { restore, finalRestore, collectionStub, findStub } = fakeMongo({
    toArray: fakeCollections.contacts
  })

  afterEach(restore)

  afterAll(finalRestore)

  it('queries one document with static filter', () => {
    return each(
      connect,
      runQuery('contacts', always({}), 'contactList')
    )().then(context => {
      expect(context.contactList).toBeTruthy()
      expect(context.contactList).toEqual(fakeCollections.contacts)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findStub.args[0][0]).toEqual({})
    })
  })

  it('queries one document with options', () => {
    return each(
      connect,
      runQuery(
        'contacts',
        always({}),
        'contactList',
        always({ projection: { name: 1, email: 1 } })
      )
    )().then(context => {
      expect(context.contactList).toBeTruthy()
      expect(context.contactList).toEqual(fakeCollections.contacts)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findStub.args[0][0]).toEqual({})
      expect(findStub.args[0][1]).toEqual({ projection: { name: 1, email: 1 } })
    })
  })

  it('queries one document with dynamic filter', () => {
    return each(
      connect,
      runQuery(
        'contacts',
        props({ group: prop('selectedGroup') }),
        'contactList'
      )
    )({ selectedGroup: 'teamA' }).then(context => {
      expect(context.contactList).toBeTruthy()
      expect(context.contactList).toEqual(fakeCollections.contacts)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findStub.args[0][0]).toEqual({ group: 'teamA' })
    })
  })
})
