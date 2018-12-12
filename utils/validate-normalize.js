
const formatValidateError = (joiError) => {
  const err = new Error(joiError.message);
  err.reason = "ValidationError";
  err.status = 422;
  return err;
};

module.exports = { formatValidateError };