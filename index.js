const { connectMongoDB, closeMongoDB } = require('./src/connection')
const {
  runQueryOne,
  runQuery,
  runQueryAggregation,
  runQueryExists,
  runQueryCount
} = require('./src/queries')
const {
  createDocument,
  updateDocumentOne,
  upsertDocument
} = require('./src/updates')

module.exports = {
  connectMongoDB,
  closeMongoDB,

  runQueryOne,
  runQuery,
  runQueryAggregation,
  runQueryExists,
  runQueryCount,

  createDocument,
  updateDocumentOne,
  upsertDocument
}
