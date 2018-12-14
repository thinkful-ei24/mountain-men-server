const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const {requireFields} = require('../utils/validation');

const router = express.Router();

// public profile info
router.get('/:id', (req, res, next) => {
  const {id} = req.params;

  User.findById(id)
    .then(dbRes => {
      const profileInfo = dbRes.toJSON();
      delete profileInfo.address;
      // delete profileInfo.phoneNumber;
      // delete profileInfo.email;
      // TODO: delete new location information once it's set in user
      res.json(profileInfo);
    })
    .catch(err => {
      return next(err);
    });
});

router.use(
  "/",
  passport.authenticate("jwt", { session: false, failWithError: true })
);

const reqProfileFields = ['email', 'firstName', 'lastName', 'phoneNumber', 'address', 'type'];
router.put('/:id', requireFields(reqProfileFields), (req, res, next) => {
  console.log('hello');
  const {id: userId} = req.user;
  const {email, firstName, lastName, phoneNumber, address, type} = req.body;

  const updatedObject = {
    email, firstName, lastName, phoneNumber, address, type
  };

  console.log(updatedObject);

  if(userId !== req.params.id) {
    const err = new Error('Unauthorized to edit this profile');
    err.status = 401;
    return next(err);
  }

  User.findOneAndUpdate({_id: userId}, updatedObject, {new: true})
    .then(dbRes => {
      return res.json(dbRes);
    })
    .catch(err => {
      err.status = 400;
      return next(err);
    });
});

module.exports = router;