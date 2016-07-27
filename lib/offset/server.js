'use strict'
const { ClocksyServer } = require('clocksy')
const clocksy = new ClocksyServer()
module.exports = function offset (data, connection) {
  if (data.type && data.type === 'clock') {
    connection.send(JSON.stringify({
      type: 'clock',
      data: clocksy.processRequest(data.data)
    }))
  }
}
