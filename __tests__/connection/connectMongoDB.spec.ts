import { each, always, Context } from 'rvl-pipe'
import { connectMongoDB } from '../../src'
import { fakeMongo } from '../helpers/mongo'

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

describe('connectMongoDB', () => {
  const { connectStub, dbStub, restore, finalRestore } = fakeMongo()

  afterEach(restore)

  afterAll(finalRestore)

  it('connects to DB', () => {
    return each(connect, (ctx: Context) => {
      expect(ctx.mongodb).toBeTruthy()
      expect(connectStub.args[0][0]).toBe('fakeUrl')
      expect(dbStub.args[0][0]).toBe('fakeDB')

      return Promise.resolve(ctx)
    })()
  })

  it('should not attempt connect if there is already a mongodb object on context', () => {
    return each(
      connect,
      connect,
      (ctx: Context): Promise<Context> => {
        expect(ctx.mongodb).toBeTruthy()
        expect(connectStub.callCount).toBe(1)
        expect(dbStub.callCount).toBe(1)

        return Promise.resolve(ctx)
      }
    )()
  })
})
