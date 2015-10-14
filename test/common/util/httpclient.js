describe('HTTP Request', function () {
  var HttpClient = require('../../../lib/utils/http/client')

  var counter, req, res
  beforeEach(function () {
    counter = 0
  })

  describe('Instance check', function () {
    it('should be able to create a HttpClient instance without crashing', function () {
      req = new HttpClient()
    })
  })

  describe('GET method', function () {
    it('allow to perform GET requests and receive already parsed JSON', function (done) {
      req = new HttpClient({
        on: {
          data: function (data, event) {
            expect(data).to.be.an('array')
            expect(data).to.have.length(100)
            done()
          }
        }
      })
      req.GET('http://jsonplaceholder.typicode.com/posts', true)
    })

    it('allow to perform GET requests and receive non parsed responses', function (done) {
      req = new HttpClient({
        on: {
          data: function (data, event) {
            expect(data).to.be.a('string')
            expect(JSON.parse(data)).to.have.length(100)
            done()
          }
        }
      })
      req.GET('http://jsonplaceholder.typicode.com/posts')
    })
  })

  describe('POST method', function () {
    it('allow to perform POST requests', function (done) {
      req = new HttpClient({
        on: {
          data: function (data, event) {
            expect(data.title).to.equal('My Awesome Title')
            done()
          },
          error: function () {
            console.log(arguments)
            done()
          }
        }
      })
      req.POST('http://jsonplaceholder.typicode.com/posts', {
        title: 'My Awesome Title'
      }, true)
    })
  })
})
