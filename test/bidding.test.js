'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const User = require('../seed-data/users');
const Post = require('../models/post');
const Bid = require('../models/bid');
const users = require('../seed-data/users');
const jobs = require('../seed-data/jobs');
const bids = require('../seed-data/bids');

const {TEST_DATABASE_NAME, JWT_SECRET} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

describe.skip('Posting job requests and bidding', function() {

  before(function() {
    return dbConnect(TEST_DATABASE_NAME);
  });
  
  after(function() {
    return dbDisconnect();
  });
  
  let user;
  let token;

  beforeEach(function () {
    // sandbox
    return Promise.all([
      User.insertMany(users),
      Post.insertMany(jobs),
      Bid.insertMany(bids)
    ])
      .then(res => {
        user = res[0][0];
        token = jwt.sign({user}, JWT_SECRET, {subject: user.email});
      });
  });

  afterEach(function () {
    // sandbox.restore();
    return Promise.all([
      User.deleteMany(),
      Post.deleteMany(),
      Bid.deleteMany()
    ]);
  });

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
