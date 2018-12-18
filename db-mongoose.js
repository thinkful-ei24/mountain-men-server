'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, DATABASE_NAME } = require('./config');

function dbConnect(dbName = DATABASE_NAME, url = DATABASE_URL) {
  if(!dbName) {
    throw Error('No database name specified');
  }
  return mongoose.connect(url, {dbName})
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}

function dbDisconnect() {
  return mongoose.disconnect();
}

function dbGet() {
  return mongoose;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};
