const express = require("express");
const {requireFields, trimmedFields} = require("../utils/validation");
const {formatValidateError} = require('../utils/validate-normalize');
const Joi = require('joi');

const axios = require("axios");
const { GEOCODE_URL } = require("../config");
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
  type: Joi.string(),
  address: Joi.object().pattern(/.*/, [Joi.string(), Joi.string(), Joi.string(), Joi.string()]),
  coords: Joi.object()
});

const expectedFields = ["email", "password", "firstName", "lastName", "phoneNumber", "type", "address"];
const explicityTrimmedFields = ["email", "password"];
router.post("/", requireFields(expectedFields),
  trimmedFields(explicityTrimmedFields), (req, res, next) => {

    let userData = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      type: req.body.type,
      address: req.body.address
    };

    const {address} = req.body;
    const apiString = `${address.street} ${address.city} ${address.state} ${address.zip}`;
    axios
      .get(GEOCODE_URL, {
        params: {
          address: apiString,
          key: process.env.MAPS_API_KEY
        }
      })

      .then(apiRes => {
        const { lat, lng } = apiRes.data.results[0].geometry.location;
        userData.coords = { lat, lng };
        return Joi.validate(userData, userSchema)
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
  });

module.exports = router;
