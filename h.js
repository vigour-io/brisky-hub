'use strict'
const Hub = require('./')
module.exports = function (val, stamp) {
  // what about allowing objects for stamp that have type, src
  // val then calling vstamp in these functions? makes it super easy
  return new Hub(val, stamp || false)
}
