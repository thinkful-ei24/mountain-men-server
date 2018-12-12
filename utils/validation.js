const middlewareValidators = {
  requireFields: (reqFields) => (req, res, next) => {
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: "ValidationError",
        message: "Missing Field",
        location: missingField
      });
    }
    return next();
  },

  trimmedFields: (trimmedFields) => (req, res, next) => {
    const nonTrimmedField = trimmedFields.find(
      field => (req.body[field].trim() !== req.body[field])
    );
  
    if (nonTrimmedField) {
      return res.status(422).json({
        code: 422,
        reason: "ValidationError",
        message: "Cannot start or end with whitespace",
        location: nonTrimmedField
      });
    }
    return next();
  }
};

module.exports = middlewareValidators;