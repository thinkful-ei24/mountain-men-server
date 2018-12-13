'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');

const {TEST_DATABASE_URL} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

describe('User and profile endpoints', function() {

  before(function() {
    return dbConnect(TEST_DATABASE_URL);
  });
  
  after(function() {
    return dbDisconnect();
  });

  // beforeEach(function () {
  //   // sandbox
  //   return Promise.all([
  //     // insertMany
  //   ])
  //     .then(res => {
  //       console.log(res);
  //       // user = users[0];
  //       // token = jwt.sign({user}, JWT_SECRET, {subject: user.username});
  //     });
  // });

  // afterEach(function () {
  //   // sandbox.restore();
  //   return Promise.all([
  //     // deleteMany
  //   ]);
  // });

  describe.only('POST /register', function() {
    it.only('should create a new account when given valid credentials', function() {
      const data = {
        email: 'testaccount@email.com',
        password: 'passwordwithmorethansixcharacters',
        firstName: 'foo',
        lastName: 'bar',
        phoneNumber: '7777777',
        address: '101 Bot Drive',
        type: 'DRIVER'
      };
      return chai.request(app)
        .post('/register')
        .send(data)
        .then(res => {
          // TODO: add more thorough testing
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
        });
    });

    it('should fail to create an account when some fields are missing', function() {
  
    });

    it('should fail to create an account when an email address is already in use', function() {
  
    });
  });

  describe('PUT /api/profile', function() {
    it('should change user profile information given all the required fields', function() {

    });

    it('should not modify user profile settings if fields are missing', function() {
  
    });
  });

  describe('GET /api/profile', function() {
    it('should show a limited amount of data for all user accounts', function() {

    });

    it('should only show personal information for the authorized user, not other accounts', function() {
      
    });
  });
});