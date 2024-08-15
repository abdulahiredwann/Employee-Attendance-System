// Validate Employer

const Joi = require("joi");

function validateEmployee(employee) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    email: Joi.string().min(5).max(1000).required(),
    password: Joi.string().min(6).max(100).required(),
  });

  return schema.validate(employee);
}
function validateLogin(employee) {
  const schema = Joi.object({
    email: Joi.string().email().min(2).max(100).required(),
    password: Joi.string().min(6).max(100).required(),
  });

  return schema.validate(employee);
}

module.exports = {
  validateEmployee,
  validateLogin,
};
