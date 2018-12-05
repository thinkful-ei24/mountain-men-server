const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.String;

const postSchema = new mongoose.Schema({
  userId: {type: ObjectId, ref: 'User'},
  title: String,
  bid: Number,
  rating: Number,
  description: String
});

postSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('Post', postSchema);