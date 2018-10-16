const { connectMongoDB, closeMongoDB } = require('./lib/connection')
const { runQueryOne, runQuery, runQueryExists, runQueryCount, runQueryPage } = require('./lib/queries')
const { createDocument, updateDocumentOne, upsertDocument } = require('./lib/updates')

module.exports = {
  connectMongoDB,
  closeMongoDB,

  runQueryOne,
  runQuery,
  runQueryExists,
  runQueryCount,
  runQueryPage,

  createDocument,
  updateDocumentOne,
  upsertDocument
}
