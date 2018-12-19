const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const {requireFields} = require('../utils/validation');

const removeEmpty = (obj) =>
  Object.keys(obj)
    .filter(key => obj[key] !== null && obj[key] !== undefined)
    .reduce((newObj, key) => {
      // https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
      if(typeof obj[key] === 'object') {
        return Object.assign(newObj, {[key]: removeEmpty(obj[key])}); // for nested objects
      } else {
        return Object.assign(newObj, {[key]: obj[key]}); // copy
      }
    }, {});

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

router.put('/:id', (req, res, next) => {
  const {id: userId} = req.user;
  const {email, firstName, lastName, phoneNumber, address, type} = req.body;

  console.log('PROFILE PUT', userId);

  let updatedObject = {
    email, firstName, lastName, phoneNumber, address, type
  };

  updatedObject = removeEmpty(updatedObject);

  // FIXME: update id check

  if(userId !== req.params.id) {
    const err = new Error('Unauthorized to edit this profile');
    err.status = 401;
    return next(err);
  }

  console.log('NEW OBJ', updatedObject);
  
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