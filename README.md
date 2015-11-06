# vigour-hub
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/vigour-hub.svg)](https://badge.fury.io/js/vigour-hub)

Synchronization of observables over multiple protocols

```javascript
var Hub = require('vigour-hub')
var hub = new Hub({
  adapter: {
    // use web socket protocol
    inject: require('vigour-hub/lib/adapter/websocket'),
    // connects to localhost:3031
    val: 'localhost:3031',
    // listens on port 3032
    listen: 3032
  }
})
```
