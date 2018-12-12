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

describe('Posting job requests and bidding') {

  before(function() {
    return dbConnect(TEST_DATABASE_URL);
  });
  
  after(function() {
    return dbDisconnect();
  });

  it('should create an empty job posting') {

  }
  it('should fail to create a job posting if fields are missing or invalid') {

  }
  it('should add a bid to a posting if the bid is valid') {

  }
  it('should not add a bid if it is not valid') {

  }
  it('should not allow multiple bids to be posted on the same job') {

  }
  it('should not allow users to post jobs on behalf of other users') {
    
  }
}

describe('Mocha and Chai', function() {
  it('should be properly setup', function() {
    expect(true).to.be.true;
  });
});
