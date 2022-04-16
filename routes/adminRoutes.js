const router = require('express').Router();
const jwt = require('jsonwebtoken')
const functions = require('../function')
const userValidator = require('../validators/userValidator')
const adminValidator = require('../validators/adminValidator')
const services = require('../services/adminServices')
//Admin Signup

router.post('/adminSignup', adminValidator.adminSignupReqValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.adminSignup(payLoad);
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

//Admin signin

router.post('/adminSignin', userValidator.signinReqValidator,
    async (req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.adminSignIn(payLoad);
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


//Admin signin via accesstoken

router.post('/adminSigninviatoken',
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

            let data = await services.adminSigninViaTokenService(token);
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

//Admin Logout

router.post('/adminLogout',
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

            let data = await services.adminLogout(token);
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