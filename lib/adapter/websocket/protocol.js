var Protocol = require('../../protocol')

var wsProtocol = new Protocol({
  url: {
    on: {
      data: function (data, event) {
        console.log('ws protocol url on data')
      }
    }
  },
  listens: {
    on: {
      data: function (data, event) {
        console.log('ws protocol listens on data')
      }
    }
  }
})

module.exports = wsProtocol.Constructor
