const router = require('express').Router();
const jwt = require('jsonwebtoken')
const functions = require('../function')
const userValidator = require('../validators/userValidator')
const services = require('../services/userServices')
console.log("userRoutes....................")


//Signup

router.post('/signup', userValidator.signupReqValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userSignup(payLoad);
            console.log(newData)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Signup successful",
                    data: newData.userData
                })
            } else if (newData.findData) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "Email already exists",
                    data: {}
                })
            } else if (newData.mobileData) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "Mobile no. already exists",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 403,
                    message: "User already registered",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Signup unsuccessful",
                data: {}
            })
        }

    })


//Get All Users
router.get('/getAllUsers',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);
            console.log("Get all users")
            let data = await services.getAllUsers(token);
            if (data.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "All users successfully fetched",
                    data: data.userData
                })
            } else if (data.token) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access token does not found",
                    data: {}
                })
            } else if (data.user) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User does not found",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Users does not fetched",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Users does not fetched",
                data: {}
            })

        }

    })

//Delete All Users

router.delete('/deleteAllUsers',
    async (req, res) => { 
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);
            console.log("Delete All Users")
            let data = await services.deleteAllUsers(token);
            if (data.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "All users successfully deleted",
                    data: data.userData
                })
            } else if (data.token) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access token does not found",
                    data: {}
                })
            } else if (data.user) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User is not present",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "User does not gets deleted",
                    data: {}
                })
            }
        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Users does not gets deleted",
                data: {}
            })
        }
    })

//Verify OTP
router.post('/verifyOTP', userValidator.verifyOTPValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            console.log(payLoad);
            let newData = await services.verifyOTPServices(payLoad);
            console.log(newData.find.isVerified)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "OTP verified",
                    data: newData.userData
                })
            } else if (newData.find.isVerified == true) {
                return res.status(200).json({
                    statusCode: 409,
                    message: "User is already verified",
                    data: {}
                })
            } else if (newData.find) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "OTP is not correct",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Mobile no. is not correct",
                    data: {}
                })
            }
        }
        catch (error) {
            console.log(error);

        }
    })

//Payment details

router.post('/payment', userValidator.paymentDetailsValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userPaymentDetails(payLoad);
            console.log(newData)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Payment details successfully added",
                    data: newData.userData
                })
            } else if (newData.name) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User does not exists",
                    data: {}
                })
            } else if (newData.verified) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "User is not verified,please verify the user.",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Payment details does not added",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Payment details does not added",
                data: {}
            })
        }

    })

//Signin

router.post('/signin', userValidator.signinReqValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userSignIn(payLoad);
            console.log(newData)
            console.log(newData.data)
            if (newData.userInfo) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "SignIn successful",
                    data: newData.userInfo
                })
            } else if (newData.verification) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "User is not verified, please verify first and then signin",
                    data: {}
                })
            } else if (!newData.data) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User not found",
                    data: {}
                })
            } else if (!newData.isPasswordValid) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Incorrect password",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Signin unsuccessful",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Signin unsuccessful",
                data: {}
            })
        }

    })


//Signin via accesstoken

router.post('/signinviatoken',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);
            let data = await services.signinViaTokenService(token);
            console.log("...................................." + data.userInfo + ".............................")
            if (data.userInfo) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Signin successful",
                    data: data.userInfo
                })
            } else if (!data.userData) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User not found",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Signin unsuccessful",
                    data: {}
                })
            }
        } catch (error) {
            return res.status(200).json({
                statusCode: 401,
                message: "Access token is not correct",
                data: {}
            })
        }
    })

//Edit profile:-

router.put('/editProfile',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            let decodeCode = await functions.authenticate(token)
            if (!decodeCode) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            token.accessToken = decodeCode.accessToken
            let payLoad = req.body;
            let newData = await services.updateProfile(payLoad, token);
            console.log(newData)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Profile successfully updated",
                    data: newData.userData
                })
            } else if (newData.Invalid) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Invalid credentials",
                    data: {}
                })
            } else if (newData.invalid) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Access token or email is not correct",
                    data: {}
                })
            } else if (newData.accesstoken) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access token not found",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Profile does not updated",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Profile does not updated",
                data: {}
            })


        }

    })


//User reset password
router.post('/resetPassword', userValidator.resetPasswordValidator,
    async (req, res) => {
        try {

            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            let decodeCode = await functions.authenticate(token)
            if (!decodeCode) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            token.accessToken = decodeCode.accessToken
            let payLoad = req.body;
            let newData = await services.resetPassServices(payLoad, token);
            console.log(newData)
            if (newData.updateData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Password successfully updated",
                    data: newData.updateData
                })
            } else if (!newData.findData) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User does not exists",
                    data: {}
                })
            }
            else if (newData.confirm) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Confirm password is not correct",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Password does not updated",
                    data: {}
                })
            }
        }
        catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 400,
                message: "Password does not updated",
                data: {}
            })
        }
    })

//Verify

router.post('/verify', userValidator.verifyValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            console.log(payLoad);
            let findData = await services.userVerify(payLoad);
            if (findData.sendMail) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Mail successfully send",
                    data: findData.sendMail
                })
            } else if (findData.invalid) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Username is invalid",
                    data: {}
                })
            } else if (findData.data) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "OTP does not created",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Mail does not send",
                    data: {}
                })
            }
        }
        catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 400,
                message: "Failure",
                data: {}
            })
        }
    })

//User forgot password
router.post('/forgotPassword', userValidator.forgotPasswordValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.forgotPassServices(payLoad);
            if (newData.updateData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Password successfully updated",
                    data: newData.updateData
                })
            } else if (!newData.findData) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User does not exists",
                    data: {}
                })
            } else if (newData.confirm) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Confirm password is not correct",
                    data: {}
                })
            } else if (newData.verify) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "OTP is not correct",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Password does not updated",
                    data: {}
                })
            }
        }
        catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 400,
                message: "Password does not updated",
                data: {}
            })
        }
    })

//Booking-:

router.post('/booking', userValidator.bookingReqValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userBooking(payLoad);
            console.log(newData)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Booking successful",
                    data: newData.userData
                })
            } else if (newData.noofpassenger) {
                return res.status(200).json({
                    statusCode: 422,
                    message: "More than 5 passengers are not allowed, you can book two or more taxis using same username.",
                    data: {}
                })
            } else if (newData.drivername) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Driver is not registered",
                    data: {}
                })
            } else if (newData.passenger) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Passenger is not registered",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 500,
                    message: "Booking unsuccessful",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Booking unsuccessful",
                data: {}
            })
        }

    })


//Fetch user history
router.get('/getUserHistory',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            let decodeCode = await functions.authenticate(token)
            if (!decodeCode) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token is not correct",
                    data: {}
                })
            }
            token.accessToken = decodeCode.accessToken
            console.log("Get user history API")
            var data = await services.getUserHistory(token);
            console.log(data.userData)
            if (data.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "User history successfully fetched",
                    data: data.userData
                })
            } else if (data.empty) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User history does not present",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User history does not present",
                    data: {}
                })
            }
        } catch (error) {
            res.status(200).json({
                statusCode: 401,
                message: "Internal error, please check access token",
                data: {}
            })

        }

    })


//User Logout

router.post('/logout',
    async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let data = await services.userLogout(token);
            if (data) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Logout successful",
                    data: data
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Logout unsuccessful",
                    data: data
                })
            }
        } catch (error) {
            return res.status(200).json({
                statusCode: 401,
                message: "Access token is not correct",
                data: {}
            })
        }
    })

module.exports = router;