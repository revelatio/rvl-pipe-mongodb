const test = require('ava')
const { each, prop, props, always } = require('rvl-pipe')
const { connectMongoDB, runQueryCount } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

const connect = connectMongoDB(always('fakeUrl'), always('fakeDB'), always({}))

test.serial('returns count for filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo()

  return each(
    connect,
    runQueryCount('contacts', always({ _id: fakeCollections.contact._id }), 'countContact')
  )()
    .then(context => {
      t.true(context.hasOwnProperty('countContact'))
      t.is(context.countContact, 1)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], { _id: fakeCollections.contact._id })
      restore()
    })
})
