const { connectMongoDB, closeMongoDB } = require('./lib/connection')
const { runQueryOne, runQuery, runQueryAggregation, runQueryExists, runQueryCount } = require('./lib/queries')
const { createDocument, updateDocumentOne, upsertDocument } = require('./lib/updates')

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
