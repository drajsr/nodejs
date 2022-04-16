const { Joi, celebrate } = require('celebrate')

const driverSignupReqValidator = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().regex(/^[0-9]{10}$/).required(),
    })
})

const driverSigninReqValidator = celebrate({
    body: Joi.object().keys({
        username: Joi.string().email().required(),
        pin: Joi.string().required(),
    })
})

module.exports = { driverSignupReqValidator, driverSigninReqValidator }