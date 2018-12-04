const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../models/user");

const localStrategy = new LocalStrategy({usernameField: "email"}, (email, password, done) => {
  console.log(email, password, 'local');
  let user;
  User.findOne({ email })
    .then(results => {
      user = results;
      if (!user) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect email",
          location: "email"
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect password",
          location: "password"
        });
      }
      return done(null, user);
    })
    .catch(err => {
      if (err.reason === "LoginError") {
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;
