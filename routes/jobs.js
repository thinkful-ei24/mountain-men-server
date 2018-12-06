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

// description ok as alphanumeric?
const postSchema = Joi.object().keys({
  title: Joi.string().min(3).max(40).required(),
  description: Joi.string().alphanum().max(400),
});

// unprotected endpoints

app.get('/:id', (req, res, next) => {
  const userId = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('Path is not a valid user id');
    return next(err);
  }

  return Post.find({userId})
    .then(dbRes => {
      return res.json(dbRes).status(200);
    }).catch(err => {
      return next(err);
    });
});

// just return all posts for now
app.get('/', (req, res, next) => {
  return Post.find()
    .then(dbRes => res.json(dbRes))
    .catch(err => next(err));
});

// protected
app.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

app.post('/:id', (req, res, next) => {
  // FIXME: doesn't check to see if the user id matches the path id
  const userId = req.user.id;
  console.log('req.user', req.user);
  console.log(typeof req.user);

  // FIXME: refactor into middleware
  const requiredFields = ["title", "description", "date"];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Missing Field",
      location: missingField
    });
  }

  const {title, description, date} = req.body;
  const jobPostingData = {
    userId, title, description, date, bids: [],
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

module.exports = app;