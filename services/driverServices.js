const functions = require('../function')
const driver = require('../models/driver')
const driverAuth = require('../models/driverAuth')
const adminAuth = require('../models/adminAuth')
const booking = require('../models/booking')
const jwt = require('jsonwebtoken');

//Driver signup:-

const driverSignup = async (payLoad) => {
    try {
        console.log(payLoad)
        let findData = await driver.findOne({ email: payLoad.email });
        console.log(findData)
        let mobileData = await driver.findOne({ mobile: payLoad.mobile });
        password = Math.floor(1000 + Math.random() * 9000);
        if (!findData) {
            if (!mobileData) {
                data = { name: payLoad.name, email: payLoad.email, mobile: payLoad.mobile, salt: payLoad.salt, pin: password }
                var userData = await driver.create(data);
                console.log(userData)
            }
        } else {
            console.log("User already signup")
        }
        console.log(userData)
        return { userData, findData, mobileData };
    } catch (error) {
        console.error(error)
        throw error
    }
}


//Get All Drivers

const getAllDrivers = async (token) => {
    console.log("Get all drivers")
    try {
        let findToken = await adminAuth.findOne({ accessToken: token });
        if (findToken) {
            console.log("getAllDrivers")
            let userData = await driver.find();
            if (userData.length) {
                return { userData };
            } else {
                let driver = "Driver is not present"
                return { driver };
            }
        } else {
            console.log("Access token not found")
            let token = "Access token not found";
            return { token };
        }
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//Delete All Driver

const deleteAllDrivers = async (token) => {
    console.log("Delete All Drivers")
    try {
        let findToken = await adminAuth.findOne({ accessToken: token });
        if (findToken) {
            console.log("deleteAllDrivers")
            let findData = await driver.find();
            if (findData.length) {
                let userData = await driver.remove();
                console.log(userData);
                return { userData };
            } else {
                console.log("Driver is not present")
                let driver = "Driver is not present"
                return { driver };
            }
        } else {
            console.log("Access token does not found")
            let token = "Access token does not found";
            return { token };
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

//Driver signin:-

const driverSignIn = async (payLoad) => {

    try {
        let data = await driver.findOne({ email: payLoad.username });
        let authData = await driverAuth.findOne({ username: payLoad.username });
        console.log(data)
        if (!data) {
            console.log("User not found")
        } else {
            var findData = await driver.findOne({ pin: payLoad.pin });
            console.log(findData)
        }
        if (!findData) {
            console.log("Incorrect password")
        } else if (authData) {
            console.log("Access token is already created")
            var userInfo = { name: data.name, email: data.email, mobile: data.mobile, pin: data.pin, accessToken: authData.accessToken }
        } else {
            let token = jwt.sign({ email: payLoad.username }, 's3cr3t');
            console.log("Token-:", token)
            var userData = await driverAuth.create({ username: payLoad.username, accessToken: token });
            var userInfo = { name: data.name, email: data.email, mobile: data.mobile, pin: data.pin, accessToken: userData.accessToken }
        }
        return { data, findData, userInfo }
    } catch (error) {
        console.log(error)
        throw error
    }
}


//Driver signin via access token:-

const driverSigninViaTokenService = async (token) => {
    try {
        let decodedData = await functions.authenticate(token);
        console.log(decodedData)
        if (!decodedData) {
            console.log("Access token is not correct")
        }
        let userData = await driverAuth.findOne({
            accessToken: token
        })
        if (!userData) {
            console.log("User not found")
        } else {
            let userInfo = await driver.findOne({ email: userData.username });
            return { userInfo, decodedData, userData }
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Get user history

const getDriverHistory = async (token) => {
    console.log("Get driver history")
    try {
        console.log("getDriverHistory")
        let findData = await driverAuth.findOne({ accessToken: token });
        let userData = await booking.find({ driver: findData.username });
        if (!userData.length) {
            var empty = "Driver history does not present";
            console.log("Driver history does not present");
            return { empty };
        } else {
            return { userData };
        }
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//Driver Logout -:

const driverLogout = async (token) => {
    try {
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            console.log("Access token not found")
        }
        token.accessToken = decodeCode.accessToken
        let deletetoken = await driverAuth.deleteOne(token.accessToken)
        return deletetoken
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = { driverSignup, getAllDrivers, deleteAllDrivers, driverSignIn, driverSigninViaTokenService, getDriverHistory, driverLogout }