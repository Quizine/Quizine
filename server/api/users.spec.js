var expect = require('chai').expect
var app = require('../index')
var request = require('supertest')

//THIS IS HOW WE'LL SOLVE THE PASSPORT PROBLEMS
//https://www.npmjs.com/package/chai-passport-strategy

//let's set up the data we need to pass to the login method
const userCredentials = {
  email: 'nathan@email.com',
  password: '123'
} //now let's login the user before we run any tests
var authenticatedUser = request.agent(app)
before(function(done) {
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end(function(err, response) {
      expect(response.statusCode).to.equal(200)
      expect('Location', '/home')
      done(err)
    })
})

describe('FE GET businessAnalytics', function(done) {
  it('should return a 200 response if the user is logged in', function(done) {
    authenticatedUser.get('/businessAnalytics').expect(200, done)
  })
})

// describe('BE /avgNumberOfGuestsVsWaitersPerOrder', function(done) {
//   it('should return an object', function(done) {
//     authenticatedUser
//       .get('/api/businessAnalytics/avgNumberOfGuestsVsWaitersPerOrder')
//       .query({
//         timeInterval: 'month'
//       })
//       .expect(200, done)
//   })
// })
