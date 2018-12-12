const express = require("express");
const {requireFields, trimmedFields} = require("../utils/validation");
const {formatValidateError} = require('../utils/validate-normalize');
const Joi = require('joi');

const User = require("../models/user");

const router = express.Router();

const passwordError = new Error('Password must be at least 6 characters long');
passwordError.status = 422;

const userSchema = Joi.object().keys({
  email: Joi.string().email({minDomainAtoms: 1}),
  password: Joi.string().min(6).max(72).error(passwordError),
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.number(),
  address: Joi.string(),
  type: Joi.string()
});

const expectedFields = ["email", "password", "firstName", "lastName", "phoneNumber", "address", "type"];
const explicityTrimmedFields = ["email", "password"];
router.post("/", requireFields(expectedFields),
  trimmedFields(explicityTrimmedFields), (req, res, next) => {

  let userData;
  return Joi.validate(req.body, userSchema, {abortEarly: true})
    .then(validatedObj => {
      userData = validatedObj;
      return User.hashPassword(userData.password);
    })
    .catch(joiError => next(formatValidateError(joiError)))
    .then(digest => {
      return User.create({
        ...userData,
        password: digest
      });
    })
    .then(result => {
      return res
        .status(201)
        .location(`/${result.id}`)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error("The email address is already in use");
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;
