import MongoClient from 'mongodb';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var connectMongoDB = function (mongoUrl, mongoDb, options) { return function (ctx) {
    if (!ctx.mongodb) {
        return MongoClient.connect(mongoUrl(ctx), (options && options(ctx)) || undefined).then(function (client) {
            return Promise.resolve(__assign(__assign({}, ctx), { mongodb: {
                    client: client,
                    db: client.db(mongoDb(ctx))
                } }));
        });
    }
    return Promise.resolve(ctx);
}; };
var closeMongoDB = function () { return function (ctx) {
    if (ctx.mongodb) {
        ctx.mongodb.client.close();
    }
    return Promise.resolve(ctx);
}; };

var merge = function (key, ctx) { return function (value) {
    var _a;
    return Object.assign(ctx, (_a = {}, _a[key] = value, _a));
}; };

var runQuery = function (collectionName, filter, name, options) { return function (ctx) {
    return ctx.mongodb.db
        .collection(collectionName)
        .find(filter(ctx), (options && options(ctx)) || undefined)
        .toArray()
        .then(merge(name, ctx));
}; };
var runQueryAggregation = function (collectionName, pipelineFns, name, options) { return function (ctx) {
    return ctx.mongodb.db
        .collection(collectionName)
        .aggregate(pipelineFns.map(function (pipelineFn) { return pipelineFn(ctx); }), (options && options(ctx)) || undefined)
        .toArray()
        .then(merge(name, ctx));
}; };
var runQueryCount = function (collectionName, filter, name) { return function (ctx) {
    return ctx.mongodb.db
        .collection(collectionName)
        .find(filter(ctx))
        .count()
        .then(merge(name, ctx));
}; };
var runQueryOne = function (collectionName, filter, name, options) { return function (ctx) {
    return ctx.mongodb.db
        .collection(collectionName)
        .findOne(filter(ctx), (options && options(ctx)) || undefined)
        .then(merge(name, ctx));
}; };
var runQueryExists = function (collectionName, filter, name) { return function (ctx) {
    return ctx.mongodb.db
        .collection(collectionName)
        .find(filter(ctx))
        .count()
        .then(function (count) { return count > 0; })
        .then(merge(name, ctx));
}; };

var createDocument = function (collectionName, document, name) { return function (ctx) {
    var newData = document(ctx);
    return ctx.mongodb.db
        .collection(collectionName)
        .insertOne(newData)
        .then(function () { return newData; })
        .then(merge(name, ctx));
}; };
var upsertDocument = function (collectionName, filter, dataCreator, name) { return function (ctx) {
    var storeData = dataCreator(ctx);
    return ctx.mongodb.db
        .collection(collectionName)
        .replaceOne(filter(ctx), storeData, { upsert: true })
        .then(function () { return storeData; })
        .then(merge(name, ctx));
}; };
var updateDocumentOne = function (collectionName, filterCreator, dataCreator) { return function (ctx) {
    var filter = filterCreator(ctx);
    var storeData = dataCreator(ctx);
    return ctx.mongodb.db
        .collection(collectionName)
        .updateOne(filter, storeData)
        .then(function () { return ctx; });
}; };

export { closeMongoDB, connectMongoDB, createDocument, runQuery, runQueryAggregation, runQueryCount, runQueryExists, runQueryOne, updateDocumentOne, upsertDocument };
//# sourceMappingURL=index.es.js.map
