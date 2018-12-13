'use strict';

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

  // TODO: beforeEach, afterEach

  describe('POST /register', function() {
    it.only('should create a new account when given valid credentials', function() {
      expect(true).to.be.true;
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

describe('Mocha and Chai', function() {
  it('should be properly setup', function() {
    expect(true).to.be.true;
  });
});
