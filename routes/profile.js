const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', {session: false, failWithError: true});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;

  User.findById(id)
    .then(dbRes => {
      delete dbRes.address;
      delete dbRes.phoneNumber;
      delete dbRes.email;
      res.json(dbRes);
    })
    .catch(err => {
      return next(err);
    });
});

// email: {type: String, required: true, unique: true},
// password: {type: String, required: true},
// firstName: {type: String, required: true},
// lastName: {type: String, required: true},
// phoneNumber: {type: String, required: true},
// address: {type: String, required: true},
// type: {type: String, enum: ['DRIVER', 'USER'], default: 'USER', required: true}
router.put('/:id', (req, res, next) => {
  const {id: userId} = req.user.id;
  Object.keys(req.body).map(key => {
    console.log('key: ', key);
    console.log(typeof key);
  });
  const changedFields = {
    // email: req.body.email,
    // firstName: req.body.firstName,
    // lastName: 
  };
  // const {}
  // FIXME: check if id matches auth id
  if(userId !== req.params.id) {
    const err = new Error('User ids do not match');
    err.status = 403;
    return next(err);
  }

  User.findOneAndUpdate({_id: userId}, changedFields, {new: true})
    .then(dbRes => {
      console.log(dbRes);
      return res.json(dbRes);
    })
    .catch(err => {
      err.status = 400;
      console.log(err);
      return next(err);
    });
});

module.exports = router;