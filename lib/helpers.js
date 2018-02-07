const R = require('ramda')

module.exports.merge = (name, ctx) => data => R.merge(ctx, {[name]: data})
