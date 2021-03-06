const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.String;

const postSchema = new mongoose.Schema({
  userId: {type: ObjectId, ref: 'User', required: true},
  title: String,
  rating: Number,
  description: String,
  accepted: {type: Boolean, default: false},
  acceptedUserId: {type: ObjectId, ref: 'User'},
  completed: { type: Boolean, default: false },
  date: Date,
  budget: String,
  coords: {
    lat: String,
    long: String
  }
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
    return ret;
  }
});

module.exports = mongoose.model('Post', postSchema);
