const Joi = require("joi");

const joiSchema = {
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
  confirmPassword: Joi.string().min(5).max(255).required(),
  newPassword: Joi.string().min(5).max(255).required(),
  otp: Joi.string().min(4).required(),
};

module.exports.joiSchema = joiSchema;

function validateUsingJoi(obj, schema) {
  return Joi.validate(obj, schema);
}
module.exports.validateUsingJoi = validateUsingJoi;
