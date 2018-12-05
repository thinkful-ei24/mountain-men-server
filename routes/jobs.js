const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const Joi = require('joi');

const Post = require('../models/post');
const User = require('../models/user');

const app = express();

// userId: {type: ObjectId, ref: 'User', required: true},
// title: String,
// rating: Number,
// description: String,
// bids: [{type: ObjectId, ref: 'User'}],
// accepted: {type: Boolean, default: false},
// acceptedUserId: {type: ObjectId, ref: 'User'}

const postSchema = Joi.object().keys({

});

app.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

app.post('/:id', (req, res, next) => {
  const userId = req.params.id;

  console.log(mongoose.Types.ObjectId.isValid(userId));
  console.log(userId);
  console.log(req.body);

  // FIXME: refactor into middleware
  const requiredFields = ["title", "description", "bids"];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing Field",
      location: missingField
    });
  }

  const {title, description, bids} = req.body;
  const jobPostingData = {
    title, description, bids,
    accepted: false, acceptedUserId: null
  };
  const isValid = Joi.validate(jobPostingData, postSchema);
  if(!isValid) {
    const err = new Error('Failed to validate input data. Make sure that the data fits validation requirements');
    return next(err);
  }

  return User.findById(userId)
    .catch(err => next(err))
    .then(() => {
      return Post.create(jobPostingData);
    })
    .then(dbRes => {
      return res.location(`${req.originalUrl}/${dbRes.id}`).status(201).json(dbRes);
    })
    .catch(err => next(err));
});

app.get('/:id', (req, res, next) => {
  const userId = req.params.id;
  return Post.find({userId})
    .then(dbRes => {
      return res.json(dbRes).status(200);
    }).catch(err => {
      return next(err);
    });
});

module.exports = app;