'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
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

describe('Posting job requests and bidding', function() {

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
      const job = {
        title: 'Test job',
        description: 'descr',
        date: JSON.stringify(Date.now()),
        // FIXME:
        budget: '1',
        street: '246 Briarwood Street',
        city: 'Waukesha',
        state: 'WI',
        zipCode: 53186
      };
      return chai.request(app)
        .post(`/api/jobs/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(job)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys(['title','description', 'date', 'budget', 'accepted', 'acceptedUserId','completed','coords', 'id', 'userId']);
        });
    });
    it('should fail to create a job posting if fields are missing or invalid', function() {
      const job = {
        title: 'Test job',
        street: '246 Briarwood Street',
        city: 'Waukesha',
        state: 'WI',
        zipCode: 53186
      };
      return chai.request(app)
        .post(`/api/jobs/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(job)
        .then(res => {
          expect(res).to.have.status(422);
        });
    });
    // FIXME: this test and the next one need to check more than just whether it's a 401
    it('should not allow users to post jobs if authorization is not set', function() {
      const job = {
        title: 'Test job',
        description: 'descr',
        date: JSON.stringify(Date.now()),
        budget: '1',
        street: '246 Briarwood Street',
        city: 'Waukesha',
        state: 'WI',
        zipCode: 53186
      };
      return chai.request(app)
        .post(`/api/jobs/${user.id}`)
        .send(job)
        .then(res => {
          expect(res).to.have.status(401);
        });
    });
    it('should not allow users to create job postings for other users', function() {
      const job = {
        title: 'Test job',
        description: 'descr',
        date: JSON.stringify(Date.now()),
        budget: '1',
        street: '246 Briarwood Street',
        city: 'Waukesha',
        state: 'WI',
        zipCode: 53186
      };
      return chai.request(app)
        .post(`/api/jobs/${users[1].id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(job)
        .then(res => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Unauthorized to post a job for this user');
        });
    });
  });

  describe('POST /api/bids/jobId', function() {
    it('should add a bid to a posting if the bid is valid', function() {
      const bid = {
        userId: '000000000000000000000001',
        jobId: '000000000000000000000002',
        bidAmount: '1',
        bidDescription: 'descr'
      };
      return chai.request(app)
        .post(`/api/bids/${bid.jobId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(bid)
        .then(res => {
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys(['userId','jobId', 'bidAmount', 'bidDescription', 'id']);
        
        });
    });
    it('should not add a bid if fields are missing', function() {
      const bid = {
        userId: '000000000000000000000001',
        jobId: '000000000000000000000002',
        bidDescription: 'descr'
      };
      return chai.request(app)
        .post(`/api/bids/${bid.jobId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(bid)
        .then(res => {
          expect(res).to.have.status(422);
        });
    });
    it('should not allow bids to be posted by unauthorized users', function() {
      const bid = {
        userId: '000000000000000000000001',
        jobId: '000000000000000000000002',
        bidAmount: '1',
        bidDescription: 'descr'
      };
      return chai.request(app)
        .post(`/api/bids/${bid.jobId}`)
        .send(bid)
        .then(res => {
          expect(res).to.have.status(401);
        });
    });
    // v2
    it.skip('should not allow multiple bids to be posted on the same job', function() {
  
    });
    // v2
    it.skip('should not add a bid if the bid is higher than the budget', function() {

    });
  });

  // v2
  describe.skip('PUT /api/bids/bidId', function() {
    it('should allow a bid to be modified, as long as the new bid is higher', function() {
      
    });
  });
});
