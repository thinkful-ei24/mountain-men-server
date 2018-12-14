'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');

const User = require('../models/user');
const {TEST_DATABASE_NAME} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

// TODO: sandbox for test coverage

describe('User and profile endpoints', function() {

  before(function() {
    return dbConnect(TEST_DATABASE_NAME);
  });
  
  after(function() {
    return dbDisconnect();
  });

  // TODO: add data for testing

  beforeEach(function () {
    // sandbox
    return Promise.all([
      User.insertMany(users)
    ])
      .then(res => {
        console.log(res);
        user = users[0];
        // token = jwt.sign({user}, JWT_SECRET, {subject: user.username});
      });
  });

  afterEach(function () {
    // sandbox.restore();
    return Promise.all([
      User.deleteMany()
    ]);
  });

  describe.only('POST /register', function() {
    it('should create a new account when given valid credentials', function() {
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
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('type', 'email', 'firstName', 'lastName', 'phoneNumber', 'address', 'fullName', 'id');
        });
    });

    it('should fail to create an account when some fields are missing', function() {
      const data = {
        email: 'invalidaccount@email.com',
        password: 'passwordwithmorethansixcharacters',
        firstName: 'foo',
        lastName: 'bar',
        phoneNumber: '7777777'
      };
      return chai.request(app)
        .post('/register')
        .send(data)
        .then(res => {
          expect(res).to.have.status(422);
          expect(res).to.be.json;
        });
    });

    it.only('should fail to create an account when an email address is already in use', function() {
      const firstAccount = {
        email: 'duplicateaccount@email.com',
        password: 'passwordwithmorethansixcharacters',
        firstName: 'foo',
        lastName: 'bar',
        phoneNumber: '7777777',
        address: '101 Bot Drive',
        type: 'DRIVER'
      };
      const secondAccount = {
        email: 'duplicateaccount@email.com',
        password: 'passwordwithmorethansixcharacters',
        firstName: 'john',
        lastName: 'doe',
        phoneNumber: '0123456',
        address: '102 Bot Drive',
        type: 'DRIVER'
      };
      return chai.request(app)
        .post('/register')
        .send(firstAccount)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res).to.have.header('location');
          return chai.request(app).post('/register').send(secondAccount);
        })
        .then(res => {
          expect(res).to.have.status(400);
        });
    });
  });

  describe('PUT /api/profile', function() {
    it('should change user profile information given all the required fields', function() {
      const data = {
        email: 'testaccount@email.com',
        password: 'passwordwithmorethansixcharacters',
        firstName: 'foo',
        lastName: 'bar',
        phoneNumber: '7777777',
        address: '101 Bot Drive',
        type: 'DRIVER'
      };
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