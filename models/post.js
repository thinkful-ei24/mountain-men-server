const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.String;

const postSchema = new mongoose.Schema({
  userId: {type: ObjectId, ref: 'User', required: true},
  title: String,
  rating: Number,
  description: String,
  bids: [{type: ObjectId, ref: 'User'}],
  accepted: {type: Boolean, default: false},
  acceptedUserId: {type: ObjectId, ref: 'User'},
<<<<<<< HEAD
  completed: { type: Boolean, default: false }
=======
  date: Date
>>>>>>> cf9c9bd7a5950999909718a171d3e2c5fff70a91
});

postSchema.virtual('id').get(function() {
  return this._id;
});

postSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    // FIXME:
    delete ret.bids;
    return ret;
  }
});

module.exports = mongoose.model('Post', postSchema);