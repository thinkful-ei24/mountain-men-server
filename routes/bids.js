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
app.get("/:id", (req, res, next) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error("Path is not a valid user id");
    err.status = 404;
    return next(err);
  }

  return Bid.find({ userId })
    .then(dbRes => {
      return res.json(dbRes).status(200);
    })
    .catch(err => {
      return next(err);
    });
});

//get post for count
app.get("/:jobId", (req, res, next) => {
  const jobId = req.params.jobId;
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error("Path is not a valid user id");
    return next(err);
  }

  return Bid.find({ userId, jobId })
    .then(dbRes => {
      return res.json(dbRes).status(200);
    })
    .catch(err => {
      return next(err);
    });
});

app.use(
  "/",
  passport.authenticate("jwt", { session: false, failWithError: true })
);

app.post("/:id", (req, res, next) => {
  // FIXME: doesn't check to see if the user id matches the path id
  const userId = req.user.id;
  console.log(req.body, req.user.id);

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


app.put("/:id", (req, res, next) => {
  const { id: userId } = req.user;
  const { jobId, bidAmount, bidDescription } = req.body;
  const updatedObject = {
    userId,
    jobId,
    bidAmount,
    bidDescription
  };

  console.log(updatedObject);

  if (userId !== req.params.id) {
    const err = new Error("Unauthorized to edit this bid");
    err.status = 401;
    return next(err);
  }

  Bid.findOneAndUpdate({ _id: userId }, updatedObject, { new: true })
    .then(dbRes => {
      return res.json(dbRes);
    })
    .catch(err => {
      err.status = 400;
      return next(err);
    });
});

module.exports = app;
