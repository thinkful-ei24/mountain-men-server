const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  address: {
    street: {type: String},
    city: {type: String},
    state: {type: String},
    zip: {type: String},
  },
  coords: {
    lat: String,
    lng: String
  },
  type: {type: String, enum: ['DRIVER', 'USER'], default: 'USER', required: true}
});

userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('id').get(function() {
  return this._id;
});

userSchema.virtual('userAddress').get(function() {
  return `${this.address.street} ${this.address.city} ${this.address.state} ${this.address.zip}`;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
