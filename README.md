# brisky-hub
[![Build Status](https://travis-ci.org/vigour-io/brisky-hub.svg?branch=master)](https://travis-ci.org/vigour-io/brisky-hub)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/brisky-hub.svg)](https://badge.fury.io/js/brisky-hub)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/brisky-hub/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/hub?branch=master)

Adds connectivity to vigour-state

```javascript
var Hub = require('vigour-hub')
// creates a hub as a server and as a client (url and port)
var hub = new Hub({
  url: 'ws://someurl.com',
  port: 80 // some port
})
```

temp solution for now add this
` "now-build": "cp uws_musl_hack/uws_linux* ./node_modules/uws"` to your pkg.json