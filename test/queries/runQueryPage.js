const test = require('ava')
const { each, prop, props, always } = require('rvl-pipe')
const { connectMongoDB, runQueryPage } = require('../../index')
const { fakeMongo, fakeCollections } = require('../helpers/mongo')

test.serial('queries one document with static filter', t => {
  const { restore, collectionStub, findStub } = fakeMongo({ toArray: fakeCollections.contacts })

  return each(
    connectMongoDB('fakeUrl', 'fakeDB'),
    runQueryPage('contacts', always({}), 'contactList', always(2), always(3))
  )()
    .then(context => {
      t.truthy(context.contactList)
      t.deepEqual(context.contactList, fakeCollections.contacts)
      t.is(collectionStub.args[0][0], 'contacts')
      t.deepEqual(findStub.args[0][0], {})
      t.is(findStub.args[1][0], 2)
      t.is(findStub.args[2][0], 3)
      restore()
    })
})

