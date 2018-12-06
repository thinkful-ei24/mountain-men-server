
const express = require('express');
const router = express.Router();
const passport = require('passport');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const jwt = require('jsonwebtoken');

const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);

function createAuthToken(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.email,
    expiresIn: JWT_EXPIRY
  });
}

const jwtAuth = passport.authenticate('jwt', {session: false, failWithError: true});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

router.post('/', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;