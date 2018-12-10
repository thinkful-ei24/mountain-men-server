const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const Joi = require("joi");

const Bid = require("../models/bid");
const User = require("../models/user");

const app = express();

// just return all posts for now
app.get("/", (req, res, next) => {
  return Bid.find()
    .then(dbRes => res.json(dbRes))
    .catch(err => next(err));
});

// protected
app.get('/:id', (req, res, next) => {
  const userId = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('Path is not a valid user id');
    return next(err);
  }
   return Bid.find({userId})
    .then(dbRes => {
      return res.json(dbRes).status(200);
    }).catch(err => {
      return next(err);
    });
});

//get post for count
app.get('/:jobId', (req, res, next) => {
  const jobId = req.params.jobId;
  const userId = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('Path is not a valid user id');
    return next(err);
  }
   return Bid.find({userId, jobId})
    .then(dbRes => {
      return res.json(dbRes).status(200);
    }).catch(err => {
      return next(err);
    });
});

app.use(
  "/",
  passport.authenticate("jwt", { session: false, failWithError: true })
);

app.post("/:id", (req, res, next) => {
  // FIXME: doesn't check to see if the user id matches the path id
  const userId = req.params.id;


  // FIXME: refactor into middleware
  const requiredFields = ["jobId", "bidAmount", "bidDescription"];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing Field",
      location: missingField
    });
  }

  const { jobId, bidAmount, bidDescription } = req.body;
  const bidPostingData = {
    userId,
    jobId,
    bidAmount,
    bidDescription
  };
  console.log(bidPostingData);
  const isValid = Joi.validate(bidPostingData);
  if (!isValid) {
    const err = new Error(
      "Failed to validate input data. Make sure that the data fits validation requirements"
    );
    return next(err);
  }

  return User.findById(userId)
    .catch(err => next(err))
    .then(() => {
      return Bid.create(bidPostingData);
    })
    .then(dbRes => {
      return res
        .location(`${req.originalUrl}/${dbRes.id}`)
        .status(201)
        .json(dbRes);
    })
    .catch(err => next(err));
});

module.exports = app;


// {
	// "email": "hi@hello",
	// "password": "hellothere",
// 	"firstName": "aaron",
// 	"lastName": "whitehead",
// 	"address": "h",
// 	"phoneNumber": "1111111111",
// 	"type": "DRIVER"
// }
// userId: "5c0dce3a6519773c8caf3458"



// {
// 	"email": "hiya@hello",
// 	"password": "hellothere",
// 	"firstName": "aaron",
// 	"lastName": "whitehead",
// 	"address": "h",
// 	"phoneNumber": "1111111111",
// 	"type": "USER"
// }
// userId: "5c0dce5b4e81d14388b7b2ff"
// authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InR5cGUiOiJVU0VSIiwiZW1haWwiOiJoaXlhQGhlbGxvIiwiZmlyc3ROYW1lIjoiYWFyb24iLCJsYXN0TmFtZSI6IndoaXRlaGVhZCIsInBob25lTnVtYmVyIjoiMTExMTExMTExMSIsImFkZHJlc3MiOiJoIiwiZnVsbE5hbWUiOiJ1bmRlZmluZWQgdW5kZWZpbmVkIiwiaWQiOiI1YzBkY2U1YjRlODFkMTQzODhiN2IyZmYifSwiaWF0IjoxNTQ0NDA4NjkwLCJleHAiOjE1NDUwMTM0OTAsInN1YiI6ImhpeWFAaGVsbG8ifQ.z6vMkIucqT6U4XmNEwhBLeU8cat_hy91utc9SkImL2E"
// jobId: "5c0dcf619ec56a27203754c5"