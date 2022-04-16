const { Joi, celebrate } = require('celebrate')

const adminSignupReqValidator = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
})

module.exports = { adminSignupReqValidator }