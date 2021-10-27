const Joi = require('joi');


// Request validator
module.exports = (schema) => (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json(result.error);
    }
    next();
}