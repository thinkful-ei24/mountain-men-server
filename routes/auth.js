
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const jwt = require('jsonwebtoken');

const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);

function createAuthToken(user) {
  console.log(user, 'user');
  return jwt.sign({user}, JWT_SECRET, {
    subject: user,
    expiresIn: JWT_EXPIRY
  });
}

const jwtAuth = passport.authenticate('jwt', {session: false, failWithError: true});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.body.email);
  res.json({ authToken });
});

router.post('/', localAuth, (req, res) => {
  console.log(req.body, 'test');
  const authToken = createAuthToken(req.body.email);
  res.json({ authToken });
});

module.exports = router;