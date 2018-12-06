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
  }
};

module.exports = middlewareValidators;