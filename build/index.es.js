import MongoClient from 'mongodb';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
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
