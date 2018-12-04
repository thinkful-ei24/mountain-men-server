
const {Stategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');

const localStrategy = new LocalStrategy((email, password, done) => {
  let user;
  user.find
})