const Joi = require('joi');

exports.addSchema = Joi.object().keys({
  symbol: Joi.string()
    .required(),
  price: Joi.number()
    .min(0)
    .required(),
  shares: Joi.number()
    .min(1)
    .required(),
  type: Joi.string()
    .valid('BUY', 'SELL')
    .required(),
});

exports.updateSchema = Joi.object().keys({
  id: Joi.string()
    .length(24)
    .required(),
  price: Joi.number()
    .min(0)
    .optional(),
  shares: Joi.number()
    .min(1)
    .optional()
});

exports.deleteSchema = Joi.object().keys({
  id: Joi.string()
    .length(24)
    .required(),
});