const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.String;

const bidSchema = new mongoose.Schema({
  userId: {type: ObjectId, ref: 'User', required: true, unique: true},
  jobId: {type: ObjectId, ref: 'Post', required: true},
  bidAmount: {type: Number, required: true},
  bidDescription: {type: String, required: true}
});

bidSchema.virtual('id').get(function() {
  return this._id;
});

bidSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Bid', bidSchema);