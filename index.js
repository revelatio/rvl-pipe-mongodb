const { connectMongoDB, closeDB } = require('./lib/connection')
const { runQueryOne, runQuery, runQueryExists } = require('./lib/queries')
const { createDocument, updateDocumentOne, upsertDocument } = require('./lib/updates')

module.exports = {
  connectMongoDB,
  closeDB,

  runQueryOne,
  runQuery,
  runQueryExists,

  createDocument,
  updateDocumentOne,
  upsertDocument
}
