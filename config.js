"use strict";

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://localhost",
  DATABASE_NAME: process.env.DATABASE_NAME || "truckd-db",
  TEST_DATABASE_NAME: process.env.TEST_DATABASE_NAME || "truckd-test-db",
  JWT_SECRET: process.env.JWT_SECRET || ".env.JWT_SECRET",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d"
};
