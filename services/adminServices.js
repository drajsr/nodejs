const functions = require('../function')
const admin = require('../models/admin')
const adminAuth = require('../models/adminAuth')
const jwt = require('jsonwebtoken');


//Admin signup:-

const adminSignup = async (payLoad) => {
    try {
        console.log(payLoad)
        let findData = await admin.findOne({ email: payLoad.email });
        console.log(findData)
        let hashObj = functions.hashPassword(payLoad.password)
        console.log(hashObj)
        delete payLoad.password
        payLoad.salt = hashObj.salt
        payLoad.password = hashObj.hash
        if (!findData) {
            var userData = await admin.create(payLoad);
            console.log(userData)
        } else {
            console.log("User already signup")
        }
        console.log(userData)
        return { userData, findData };
    } catch (error) {
        console.error(error)
        throw error
    }
}



//Admin signin:-

const adminSignIn = async (payLoad) => {

    try {
        let data = await admin.findOne({ email: payLoad.username });
        let authData = await adminAuth.findOne({ username: payLoad.username });
        console.log(data)
        if (!data) {
            console.log("User not found")
        } else {
            var isPasswordValid = functions.validatePassword(data.salt, payLoad.password, data.password);
            console.log(isPasswordValid)
        }
        if (!isPasswordValid) {
            console.log("Incorrect password")
        } else if (authData) {
            console.log("Access token already created")
            var userInfo = authData
        } else {
            let token = jwt.sign({ email: payLoad.username }, 's3cr3t');
            console.log("Token-:", token)
            var userData = await adminAuth.create({ username: payLoad.username, accessToken: token });
            var userInfo = userData
        }
        return { data, isPasswordValid, userInfo }
    } catch (error) {
        console.log(error)
        throw error
    }
}


//Admin signin via access token:-

const adminSigninViaTokenService = async (token) => {
    try {
        let decodedData = await functions.authenticate(token);
        console.log(decodedData)
        if (!decodedData) {
            console.log("Access token is not correct")
        }
        let userData = await adminAuth.findOne({
            accessToken: token
        })
        if (!userData) {
            console.log("User not found")
        } else {
            let userInfo = await admin.findOne({ email: userData.username });
            return { userInfo, decodedData, userData }
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Admin Logout

const adminLogout = async (token) => {
    try {
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            console.log("Access token not found")
        }
        token.accessToken = decodeCode.accessToken
        let deletetoken = await adminAuth.deleteOne(token.accessToken)
        return deletetoken
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = { adminSignup, adminSignIn, adminSigninViaTokenService, adminLogout }