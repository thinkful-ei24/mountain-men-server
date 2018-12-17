'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {TEST_DATABASE_NAME} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Posting job requests and bidding', function() {

  before(function() {
    return dbConnect(TEST_DATABASE_NAME);
  });
  
  after(function() {
    return dbDisconnect();
  });

  // TODO: add data for testing
  
  // beforeEach(function () {
  //   // sandbox
  //   return Promise.all([
  //     // insertMany
  //   ])
  //     .then(res => {
  //       console.log(res);
  //       // user = users[0];
  //       // token = jwt.sign({user}, JWT_SECRET, {subject: user.email});
  //     });
  // });

  // afterEach(function () {
  //   // sandbox.restore();
  //   return Promise.all([
  //     // deleteMany
  //   ]);
  // });

  // TODO: sandbox for test coverage

  describe('POST /api/jobs/userId', function() {
    it('should create an empty job posting for a particular user', function() {

    });
    it('should fail to create a job posting if fields are missing or invalid', function() {
  
    });
    it('should not allow users to post jobs on behalf of other users', function() {
    
    });
  });

  describe('POST /api/bids/jobId', function() {
    it('should add a bid to a posting if the bid is valid', function() {

    });
    it('should not add a bid if it is not valid', function() {
  
    });
    it('should not allow multiple bids to be posted on the same job', function() {
  
    });
  });

  // not implemented yet
  describe.skip('PUT /api/bids/bidId', function() {
    it('should allow a bid to be modified, as long as the new bid is higher', function() {
      
    });
  });
});

describe('Mocha and Chai', function() {
  it('should be properly setup', function() {
    expect(true).to.be.true;
  });
});
