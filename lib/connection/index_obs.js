var Observable = require('vjs/lib/observable')

var Connection = new Observable({
  on: {
    listening: function () {
      console.log('CONN listening event called')
    },
    error: function () {
      console.log('CONN error event called')
    },
    connect: function () {
      console.log('CONN connection event called')
    },
    data: function () {
      console.log('CONN data event called')
    },
    disconnect: function () {
      console.log('CONN disconnect event called')
    }
  },
  define: {
    RETRY_OPTIONS: {
      value: {
        MAX_TIMEOUT: 10000,
        TIMEOUT: 200,
        FACTOR: 1.2
      }
    },
    QUEUE_OPTIONS: {
      value: {
        DEQUEUE_SPEED: 500
      }
    },
    retryCount: {
      val: 0
    },
    clientState: {
      val: 'CLOSE'
    },
    serverState: {
      val: 'CLOSE'
    },
    queue: {
      val: []
    },
    send: function () {
      console.log('send')
    },
    reconnect: function () {
      console.log('reconnect')
    }
  }
}).Constructor

var WsConn = new Connection({
  define: {
    send: {
      val: 'send'
    },
    connect: function (url, secret) {
      console.log('WS connect', urlOrPort, secret)
    },
    listen: function (port, secret) {
      console.log('WS listen', port, secret)
      this.emit('disconnect')
    }
  }
}).Constructor

var wsServer = new WsConn();
wsServer.listen(9090, 'ajajajaj')
