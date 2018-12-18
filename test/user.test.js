'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {TEST_DATABASE_NAME, JWT_SECRET} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');

const users = require('../seed-data/users');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

describe('User and profile endpoints', function() {

  before(function() {
    return dbConnect(TEST_DATABASE_NAME);
  });
  
  after(function() {
    return dbDisconnect();
  });

  let user;
  let token;

  beforeEach(function () {
    // TODO: sandbox?
    return Promise.all([
      User.insertMany(users)
    ])
      .then(res => {
        // FIXME: why is this a 2d array
        user = res[0][0];
        token = jwt.sign({user}, JWT_SECRET, {subject: user.email});
      });
  });

  afterEach(function () {
    // sandbox.restore();
    return Promise.all([
      User.deleteMany()
    ]);
  });

  describe('POST /register', function() {
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

    it('should fail to create an account when an email address is already in use', function() {
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
        phoneNumber: '7777777',
        address: 'country roads',
      };
      return chai.request(app)
        .put(`/api/profile/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.phoneNumber).to.equal('7777777');
          expect(res.body.address).to.equal('country roads');
        });
    });
  });

  describe('GET /api/profile', function() {

    it('should show a limited amount of personal data for any user account', function() {
      return chai.request(app)
        .get(`/api/profile/${user.id}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('type', 'firstName', 'lastName', 'fullName', 'id');
        });
    });

    it('should show personal information for an authorized user', function() {
      return chai.request(app)
        .get(`/api/profile/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('type', 'firstName', 'lastName', 'fullName', 'id', 'address', 'email', 'phoneNumber');
        });
    });

    // it.only('should show a limited amount of data for all user accounts', function() {});
  });
});