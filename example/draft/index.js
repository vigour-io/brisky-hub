'use strict'

connections
  map per protocol -- has to be independent of adapters
    2 scopes share same connector is a posibility

scopes:
     hub
userA , userB

// share connection to users.vigour.io
    // scopes can be completely disconnected so have to be shared
    // protocol has a map of connections -- connections listen on not being referenced anymore
    // if not referenced anymore then drop the connection! (remove whatever)



// main hub has 2 scopes user hub has 2 scopes

adapter
  client (ref )
  input (url)
  listens (server)
  scope (ref to client scope)
  protocol (being able to switch is important!)

    on switch --->
        switch client.origin connection
        rest is handeled from the connection
          has listeners on being referenced and being unreferenced




//

/*
  adapter -- protocol to switch
  client -- connection to switch

  protocol class has all connections in a map

  posiblity to SHARE a connection

  how to test?


  //this is the bacis setup
  var a = new Hub({
    adapter: 'bla.com'
  })

  var b = new Hub({
    adapter: 'bla.com'
  })

  //this is the more advanced setup
  var a = new Hub({
    adapter: 'bla.com'
  })
  var b = a.getScope('b')
  b.adapter.scope.val = 'b' //resolves

  //share connection 2 different scopes

 */
