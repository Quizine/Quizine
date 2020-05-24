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
