const express = require("express");
const {requireFields} = require("../utils/validation");

const User = require("../models/user");

const router = express.Router();

const expectedFields = ["email", "password", "firstName", "lastName", "phoneNumber", "address", "type"];

router.post("/", requireFields(expectedFields), (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  // string fields

  const stringFields = ["email", "password"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }

  // trimmed fields

  const explicityTrimmedFields = ["email", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

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
        email,
        password: digest,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        type: req.body.type
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
