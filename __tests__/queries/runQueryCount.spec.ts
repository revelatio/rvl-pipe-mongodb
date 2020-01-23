import { each, always } from 'rvl-pipe'
import { connectMongoDB, runQueryCount } from '../../src'
import { fakeMongo, fakeCollections } from '../helpers/mongo'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('runQueryCount', () => {
  const { restore, finalRestore, collectionStub, findStub } = fakeMongo()

  afterEach(restore)

  afterAll(finalRestore)

  it('returns count for filter', () => {
    return each(
      connect,
      runQueryCount(
        'contacts',
        always({ _id: fakeCollections.contact._id }),
        'countContact'
      )
    )().then(context => {
      expect(context.hasOwnProperty('countContact')).toBe(true)
      expect(context.countContact).toBe(1)
      expect(collectionStub.args[0][0]).toBe('contacts')
      expect(findStub.args[0][0]).toEqual({ _id: fakeCollections.contact._id })
    })
  })
})
