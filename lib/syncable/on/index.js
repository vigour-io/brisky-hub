'use strict'
exports.inject = [
  require('./upstream'),
  require('./subscribe'),
  require('./methods')
]

exports.properties = {
  cachedSyncPath: true
}
