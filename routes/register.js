const express = require("express");
const {requireFields, trimmedFields} = require("../utils/validation");
const Joi = require('joi');

const User = require("../models/user");

const router = express.Router();

const userSchema = Joi.object().keys({
  email: Joi.string().email({minDomainAtoms: 1}),
  password: Joi.string().min(6).max(72)
});

const expectedFields = ["email", "password", "firstName", "lastName", "phoneNumber", "address", "type"];
const explicityTrimmedFields = ["email", "password"];
router.post("/", requireFields(expectedFields),
  trimmedFields(explicityTrimmedFields), (req, res, next) => {
  const { email, password } = req.body;

  const userData = {
    email,
    password: digest,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    type: req.body.type
  };
  const result = Joi.validate(userData, userSchema);
  console.log(result);

  // string fields

  // if (nonStringField) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: "ValidationError",
  //     message: "Incorrect field type: expected string",
  //     location: nonStringField
  //   });

  // joi validation

  const sizedFields = {
    email: {
      min: 1
    },
    password: {
      min: 5,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `Password must be at least ${
            sizedFields[tooSmallField].min
          } characters long`
        : `Password must be at most ${
            sizedFields[tooLargeField].max
          } characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  console.log('find user by email');
  return User.find({ email })
    .count()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({
          code: 422,
          reason: "ValidationError",
          message: "Username already taken",
          location: "email"
        });
      }
      return User.hashPassword(password);
    })
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
        err = new Error("The email already exists");
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;
