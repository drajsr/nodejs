const router = require('express').Router();
const jwt = require('jsonwebtoken')
const functions = require('../function')
const driverValidator = require('../validators/driverValidator')
const services = require('../services/driverServices')
console.log("driverRoutes....................")

//Driver signup

router.post('/driverSignup', driverValidator.driverSignupReqValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.driverSignup(payLoad);
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

//Get All Drivers
router.get('/getAllDrivers',
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
            console.log("Get all drivers")
            let data = await services.getAllDrivers(token);
            if (data.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "All drivers successfully fetched",
                    data: data.userData
                })
            } else if (data.token) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access token does not found",
                    data: {}
                })
            } else if (data.driver) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Driver does not found",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Drivers does not fetched",
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

//Delete All Drivers

router.delete('/deleteAllDriver',
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
            console.log("Delete All Drivers")
            let data = await services.deleteAllDrivers(token);
            if (data.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "All drivers successfully deleted",
                    data: data.userData
                })
            } else if (data.token) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access token does not found",
                    data: {}
                })
            } else if (data.driver) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Driver is not present",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Drivers does not gets deleted",
                    data: {}
                })
            }
        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Drivers does not gets deleted",
                data: {}
            })


        }
    })

//Driver signin-:

router.post('/driverSignin', driverValidator.driverSigninReqValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.driverSignIn(payLoad);
            console.log(newData)
            console.log(newData.data)
            if (newData.userInfo) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "SignIn successful",
                    data: newData.userInfo
                })
            } else if (!newData.data) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Driver not found",
                    data: {}
                })
            } else if (!newData.findData) {
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


//Driver signin via accesstoken

router.post('/driverSignInviaToken',
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

            let data = await services.driverSigninViaTokenService(token);
            if (data.userInfo) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Signin successful",
                    data: data.userInfo
                })
            } else if (!data.userData) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Driver not found",
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


//Fetch driver history
router.get('/getDriverHistory',
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
            console.log("Get driver history API")
            let data = await services.getDriverHistory(token);
            if (data.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Driver history successfully fetched",
                    data: data.userData
                })
            } else if (data.empty) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Driver history does not present",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Driver history does not present",
                    data: {}
                })
            }
        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Driver history does not fetched",
                data: {}
            })

        }

    })


//Driver Logout

router.post('/driverLogout',
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

            let data = await services.driverLogout(token);
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

module.exports = router;