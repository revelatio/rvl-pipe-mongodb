import { each, always } from 'rvl-pipe'
import { connectMongoDB, closeMongoDB } from '../../src'
import { fakeMongo } from '../helpers/mongo'
import { Context } from 'rvl-pipe'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('closeMongoDB', () => {
  const { restore, finalRestore, closeStub } = fakeMongo()

  afterEach(restore)

  afterAll(finalRestore)

  it('closes connexion to DB', () => {
    return each(
      connect,
      (ctx: Context) => {
        expect(ctx.mongodb).toBeTruthy()
        return Promise.resolve(ctx)
      },
      closeMongoDB(),
      (ctx: Context) => {
        expect(closeStub.callCount).toBe(1)
        return Promise.resolve(ctx)
      }
    )()
  })

  it('should not close if not open', () => {
    return each(closeMongoDB(), (ctx: Context) => {
      expect(closeStub.callCount).toBe(0)
      return Promise.resolve(ctx)
    })()
  })
})
