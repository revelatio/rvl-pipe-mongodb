import { each, prop, props, always } from 'rvl-pipe'
import { connectMongoDB, runQueryAggregation } from '../../src'
import { fakeMongo, fakeCollections } from '../helpers/mongo'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('runQueryAggregation', () => {
  const { restore, finalRestore, collectionStub, aggregateStub } = fakeMongo({
    toArray: fakeCollections.contacts
  })

  afterEach(restore)

  afterAll(finalRestore)

  it('queries one document with static filter', () => {
    return each(
      connect,
      runQueryAggregation('contacts', [always({})], 'contactList')
    )().then(context => {
      expect(context.contactList).toBeTruthy()
      expect(context.contactList).toEqual(fakeCollections.contacts)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(aggregateStub.args[0][0]).toEqual([{}])
    })
  })

  it('queries one document with options', () => {
    return each(
      connect,
      runQueryAggregation(
        'contacts',
        [always({})],
        'contactList',
        always({ option: { key: 'value' } })
      )
    )().then(context => {
      expect(context.contactList).toBeTruthy()
      expect(context.contactList).toEqual(fakeCollections.contacts)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(aggregateStub.args[0][0]).toEqual([{}])
      expect(aggregateStub.args[0][1]).toEqual({ option: { key: 'value' } })
    })
  })

  it('queries one document with dynamic filter', () => {
    return each(
      connect,
      runQueryAggregation(
        'contacts',
        [props({ group: prop('selectedGroup') })],
        'contactList'
      )
    )({ selectedGroup: 'teamA' }).then(context => {
      expect(context.contactList).toBeTruthy()
      expect(context.contactList).toEqual(fakeCollections.contacts)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(aggregateStub.args[0][0]).toEqual([{ group: 'teamA' }])
    })
  })
})
