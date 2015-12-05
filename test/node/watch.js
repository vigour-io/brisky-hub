try {
  require('./index.js')
} catch (e) {
  console.log('yeey')
}

var spawn = require('child_process').spawn
var gaston = spawn( //eslint-disable-line
  'gaston',
  ['test', '-r', 'node', '-s', process.cwd() + '/test/node/index.js'],
  { stdio: 'inherit' }
)
