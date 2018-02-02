const { connectMongoDB, closeMongoDB } = require('./lib/connection')
const { runQueryOne, runQuery, runQueryExists } = require('./lib/queries')
const { createDocument, updateDocumentOne, upsertDocument } = require('./lib/updates')

module.exports = {
  connectMongoDB,
  closeMongoDB,

  runQueryOne,
  runQuery,
  runQueryExists,

  createDocument,
  updateDocumentOne,
  upsertDocument
}
