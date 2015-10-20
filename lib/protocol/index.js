var Observable = require('vjs/lib/observable')

var Protocol = new Observable({
    useVal: true,
    url: {
      on: {
        data: function (data, event) {
          console.log('Protocol - url on data fired')
        }
      }
    },
    listens: {
      on: {
        data: function (data, event) {
          console.log('Protocol - listens on data fired')
        }
      }
    }
}).Constructor

module.exports = Protocol
