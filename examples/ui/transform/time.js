'use strict'
exports.inject = require('vjs/lib/operator/transform')
function zeros (time) {
  time = '' + time
  return !time[1] ? '0' + time : time
}
exports.$transform = function (val) {
  var hours, minutes, seconds
  if (val < 14454443247) {
    minutes = val / 60
    hours = minutes / 60
    seconds = zeros(~~((minutes - ~~minutes) * 60))
    minutes = zeros(~~((hours - ~~hours) * 60))
    hours = ~~hours
  } else {
    let date = new Date(val)
    hours = date.getHours()
    minutes = zeros(date.getMinutes())
    seconds = zeros(date.getSeconds())
  }
  return `${hours}:${minutes}:${seconds}`
}
