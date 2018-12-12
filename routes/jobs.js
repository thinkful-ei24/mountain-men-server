const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const Joi = require("joi");

const {requireFields} = require('../utils/validation');
const {formatValidateError} = require('../utils/validate-normalize');
const Post = require('../models/post');

const app = express();

// description ok as alphanumeric?
const postSchema = Joi.object().keys({
  title: Joi.string().min(3).max(40).required(),
  description: Joi.string().alphanum().max(400),
  date: Joi.string()
});

// unprotected endpoints

// just return all posts for now
app.get("/", (req, res, next) => {
  return Post.find()
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
   return Post.find({userId})
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

const jobPostFields = ["title", "description", "date"];
app.post('/:id', requireFields(jobPostFields), (req, res, next) => {
  const userId = req.user.id;
  console.log(req.user, req.body);

  if(userId !== req.params.id) {
    const err = new Error('Unauthorized to post a job for this user');
    err.status = 401;
    return next(err);
  }

  // shouldn't have to look up the user id in the db because it's matched against auth
  return Joi.validate(req.body, postSchema)
    .then(obj => {
      const postData = {
        title: obj.title,
        description: obj.description,
        date: obj.date,
        userId,
        accepted: false,
        acceptedUserId: null
      };
      return Post.create(postData);
    })
    .catch(joiError => next(formatValidateError(joiError)))
    
    .then(dbRes => {
      return res
        .location(`${req.originalUrl}/${dbRes.id}`)
        .status(201)
        .json(dbRes);
    })
    .catch(err => next(err));
});

app.put("/:userId/:jobId", (req, res, next) => {
  
  const {userId, jobId} = req.params;

  const newObj = {};

  if (req.body.accepted) {
    newObj.accepted = true;
  }
  if (req.body.completed) {
    newObj.completed = true;
  }


  return Post.findOneAndUpdate({ _id: jobId, userId }, newObj, { new: true })
    .then(result => {
      res.json(result);
    })

    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
      next();
    });
});

module.exports = app;
