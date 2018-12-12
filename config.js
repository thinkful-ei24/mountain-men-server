"use strict";

console.log(process.env.DATABASE_URL);

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://localhost/mountain-men-backend",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || "mongodb://localhost/mountain-men-dev-backend",
  JWT_SECRET: process.env.JWT_SECRET || ".env.JWT_SECRET",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d"
};
