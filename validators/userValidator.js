const { Joi, celebrate } = require('celebrate')
const signupReqValidator = celebrate({
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().optional(),
    })
})

const verifyOTPValidator = celebrate({
    body: Joi.object().keys({
        username: Joi.string().email().required(),
        otp: Joi.string().regex(/^[0-9]{4}$/).required(),
    })
})

const paymentDetailsValidator = celebrate({
    body: Joi.object().keys({
        username: Joi.string().required(),
        cardNo: Joi.string().regex(/^[0-9]{16}$/).required(),
        cvv: Joi.string().regex(/^[0-9]{3}$/).required(),
    })
})

const signinReqValidator = celebrate({
    body: Joi.object().keys({
        username: Joi.string().email().required(),
        password: Joi.string().required(),
    })
})

const verifyValidator = celebrate({
    body: Joi.object().keys({
        username: Joi.string().email().required(),
    })
})

const forgotPasswordValidator = celebrate({
    body: Joi.object().keys({
        username: Joi.string().email().required(),
        otp: Joi.string().regex(/^[0-9]{4}$/).required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
    })
})

const resetPasswordValidator = celebrate({
    body: Joi.object().keys({
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
    })
})

const bookingReqValidator = celebrate({
    body: Joi.object().keys({
        username: Joi.string().required(),
        driver: Joi.string().required(),
        pickupData: {
            address: Joi.string().required(),
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
        },
        deliveryData: {
            address: Joi.string().required(),
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
        },
        passenger: Joi.string().required(),
        luggage: Joi.string().required(),
        stroller: Joi.string().required(),
        distance: Joi.string().required(),
        total_fare: Joi.string().required()
    })
})

module.exports = { signupReqValidator, verifyOTPValidator, paymentDetailsValidator, signinReqValidator, verifyValidator, forgotPasswordValidator, resetPasswordValidator, bookingReqValidator }