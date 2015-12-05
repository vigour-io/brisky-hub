try {
  require('./index.js')
} catch (e) {
  console.log('yeey')
}

var spawn = require('child_process').spawn
var gaston = spawn('gaston', ['test', '-r', 'node', '-s', process.cwd() + '/test/node/index.js'])

gaston.stdout.on('data', function (data) {
  process.stdout.write(data.toString())
})

gaston.on('close', function (code, signal) {
  console.log(code, signal)
})
