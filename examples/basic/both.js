var uuid = require('vjs/lib/util/uuid')
uuid = uuid.val = uuid.val + '_d_'

var server = require('./server')
// is a server and a client
server.adapter.listens.val = 3032
server.adapter.val = 'ws://localhost:3031'
// require('./dev').randomUpdate(server)

require('./dev').startRepl()

// client last stamp? it is a solution
// that way it will not send for that event ever
//
// whats happening?
//
// event is recieved
//
/*
   var a
   var b = a
   var c = b

   c -- update ---> b ---> update ---> a (recieve stamp c+'number') --> o lets send down!
   //listener fires when to laststamp is not same on emitter (so it will be send!)
   stamp is c+'number'


 */
