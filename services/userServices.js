const cardNo = require('../cardNo')
const cvv = require('../cvv')
const functions = require('../function')
const user = require('../models/user')
const booking = require('../models/booking')
const userAuth = require('../models/userAuth')
const adminAuth = require('../models/adminAuth')
const driver = require('../models/driver')
const paymentDetails = require('../models/paymentDetails')
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
//......................................................User onboard started.................................................................................................................................................................................................................................................



const userSignup = async(payLoad) => {
    try {
        console.log(payLoad)
        let findData = await user.findOne({ email: payLoad.email });
        console.log(findData)
        let mobileData = await user.findOne({ mobile: payLoad.mobile });
        let hashObj = functions.hashPassword(payLoad.password)
        console.log(hashObj)
        delete payLoad.password
        payLoad.salt = hashObj.salt
        payLoad.password = hashObj.hash
        if (!findData) {
            if (!mobileData) {
                otp = Math.floor(1000 + Math.random() * 9000);
                data = { firstName: payLoad.firstName, lastName: payLoad.lastName, email: payLoad.email, mobile: payLoad.mobile, salt: payLoad.salt, password: payLoad.password, otp: otp }
                var userData = await user.create(data);
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


//Signup:-

// const userSignup = async (payLoad) => {
//     try {
//         console.log(payLoad)
//         let findData = await user.findOne({ email: payLoad.email });
//         console.log(findData)
//         let mobileData = await user.findOne({ mobile: payLoad.mobile });
//         let hashObj = functions.hashPassword(payLoad.password)
//         console.log(hashObj)
//         delete payLoad.password
//         payLoad.salt = hashObj.salt
//         payLoad.password = hashObj.hash
//         if (!findData) {
//             if (!mobileData) {
//                 otp = Math.floor(1000 + Math.random() * 9000);
//                 data = { firstName: payLoad.firstName, lastName: payLoad.lastName, email: payLoad.email, mobile: payLoad.mobile, salt: payLoad.salt, password: payLoad.password, otp: otp }
//                 var userData = await user.create(data);
//                 console.log(userData)
//             }
//         } else {
//             console.log("User already signup")
//         }
//         console.log(userData)
//         return { userData, findData, mobileData };
//     } catch (error) {
//         console.error(error)
//         throw error
//     }
// }


//Get All Users

const getAllUsers = async(token) => {
    console.log("Get all users")
    try {
        let findToken = await adminAuth.findOne({ accessToken: token });
        if (findToken) {
            console.log("getAllRegistration")
            let userData = await user.find();
            if (userData.length) {
                return { userData };
            } else {
                let user = "User is not present"
                return { user };
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

//Delete All Users

const deleteAllUsers = async(token) => {
    console.log("Delete All Users")
    try {
        let findToken = await adminAuth.findOne({ accessToken: token });
        if (findToken) {
            console.log("deleteAllUsers")
            let findData = await user.find();
            if (findData.length) {
                let userData = await user.remove();
                console.log(userData);
                return { userData };
            } else {
                console.log("User is not present")
                let user = "User is not present"
                return { user };
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

//verifyOTP:-

const verifyOTPServices = async(payLoad) => {
        try {
            let find = await user.findOne({ email: payLoad.username });
            console.log(find)
            if (find) {
                if (find.isVerified == false) {
                    if (find.otp == payLoad.otp) {
                        var userData = await user.updateOne({
                            email: payLoad.username
                        }, {
                            $set: {
                                isVerified: true
                            }
                        });
                    } else {
                        console.log("OTP is not correct")
                    }
                } else {
                    console.log("User is already verified")
                }
            } else {
                console.log("Mobile no. is not correct")
            }
            return { find, userData }
        } catch (error) {
            console.error(error);
            res.status(200).json({
                statusCode: 400,
                message: "Error",
                data: {}
            })
        }
    }
    //Payment details:-

const userPaymentDetails = async(payLoad) => {
    try {
        console.log(payLoad)
        let hashObj1 = cardNo.hashPassword(payLoad.cardNo)
        console.log(hashObj1)
        delete payLoad.cardNo
        payLoad.salt1 = hashObj1.salt
        payLoad.cardNo = hashObj1.hash
        let hashObj2 = cvv.hashPassword(payLoad.cvv)
        console.log(hashObj2)
        delete payLoad.cvv
        payLoad.salt2 = hashObj2.salt
        payLoad.cvv = hashObj2.hash
        let findUser = await user.findOne({ email: payLoad.username });
        if (findUser) {
            if (findUser.isVerified == true) {
                let data = { username: findUser.email, salt1: payLoad.salt1, cardNo: payLoad.cardNo, salt2: payLoad.salt2, cvv: payLoad.cvv }
                var userData = await paymentDetails.create(data);
                console.log("......................" + userData + ".....................................")
            } else {
                console.log("User is not verified")
                var verified = "User is not verified, please verified the user."
            }
        } else {
            console.log("Username does not exists")
            var name = "User does not exists"
        }
        console.log(userData)
        return { userData, name, verified };
    } catch (error) {
        console.error(error)
        throw error
    }
}

//Signin:-

const userSignIn = async(payLoad) => {

    try {
        let data = await user.findOne({ email: payLoad.username });
        let authData = await userAuth.findOne({ username: payLoad.username });
        console.log(data)
        if (!data) {
            console.log("User not found")
        } else if (data.isVerified == false) {
            var verification = "User is not verified"
            console.log("User is not verified")
        } else {
            var isPasswordValid = functions.validatePassword(data.salt, payLoad.password, data.password);
            console.log(isPasswordValid)
        }
        if (!isPasswordValid) {
            console.log("Incorrect password")
        } else if (authData) {
            console.log("Access token is already created.")
            var userInfo = { firstName: data.firstName, lastName: data.lastName, email: data.email, mobile: data.mobile, accessToken: authData.accessToken }
        } else {
            let token = jwt.sign({ email: payLoad.username }, 's3cr3t');
            console.log("Token-:", token)
            var userData = await userAuth.create({ username: payLoad.username, accessToken: token });
            var userInfo = { firstName: data.firstName, lastName: data.lastName, email: data.email, mobile: data.mobile, accessToken: userData.accessToken }
        }
        return { data, isPasswordValid, userInfo, verification, authData }
    } catch (error) {
        console.log(error)
        throw error
    }
}


//Signin via access token:-

const signinViaTokenService = async(token) => {
    try {
        let decodedData = await functions.authenticate(token);
        console.log(decodedData)
        if (!decodedData) {
            console.log("Access token is not correct")
        }
        let userData = await userAuth.findOne({
            accessToken: token
        })
        if (!userData) {
            console.log("User not found")
        } else {
            let userInfo = await user.findOne({ email: userData.username });
            return { userInfo, decodedData, userData }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


//Edit profile

const updateProfile = async(payLoad, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });
        if (find) {
            if (find.username == payLoad.email) {
                if (payLoad.firstName) {
                    var userData = await user.updateOne({
                        email: payLoad.email
                    }, {
                        firstName: payLoad.firstName
                    });
                }
                if (payLoad.lastName) {
                    var userData = await user.updateOne({
                        email: payLoad.email
                    }, {
                        lastName: payLoad.lastName
                    });
                }
                if (payLoad.mobile) {
                    var userData = await user.updateOne({
                        email: payLoad.email
                    }, {
                        mobile: payLoad.mobile
                    });
                }
                if (payLoad.password) {
                    let hashObj = functions.hashPassword(payLoad.password)
                    console.log(hashObj)
                    delete payLoad.password
                    payLoad.salt = hashObj.salt
                    payLoad.password = hashObj.hash
                    var userData = await user.updateOne({
                        email: payLoad.email
                    }, {
                        password: payLoad.password,
                        salt: payLoad.salt
                    });
                } else {
                    var Invalid = "Invalid credentials";
                }
            } else {
                var invalid = "Access token or email is not correct";
            }
        } else {
            console.log("Access token is null")
            var accesstoken = "Access token is null"
        }
        return { userData, Invalid, invalid, accesstoken };
    } catch (error) {
        console.error(error)
        throw error

    }

}


//Reset password:-

const resetPassServices = async(payLoad, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });
        if (find.username) {
            var findData = await user.findOne({ email: find.username });
            if (!findData) {
                return "User does not exist"
            } else {
                if (payLoad.password == payLoad.confirmPassword) {
                    let hashObj = functions.hashPassword(payLoad.password);
                    console.log(hashObj)
                    delete password;
                    payLoad.salt = hashObj.salt;
                    payLoad.password = hashObj.hash;
                    var updateData = await user.updateOne({ email: find.username }, {
                        $set: {
                            password: payLoad.password,
                            salt: payLoad.salt
                        }
                    }, { new: true });
                } else {
                    var confirm = "Confirm password is not correct"
                }
            }
        } else {
            return "User does not exists"
        }
        return { updateData, findData, confirm };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Verify

const userVerify = async(payLoad) => {
    try {
        console.log(payLoad.username)
        let find = await user.findOne({ email: payLoad.username });
        if (find) {
            var otp = Math.floor(1000 + Math.random() * 9000);
            let createData = await user.updateOne({
                email: payLoad.username
            }, {
                otp: otp
            });
            console.log(createData)
            if (createData) {
                var smtpTransport = nodemailer.createTransport({
                    pool: true,
                    host: 'mail.bityotta.com',
                    port: 465,
                    auth: {
                        user: 'test@bityotta.com',
                        pass: 'testId@123'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                const mailOptions = {
                    from: 'test@bityotta.com',
                    to: payLoad.username,
                    subject: "OTP verification mail",
                    text: "Hi, " + "\n" + "Your OTP is " + otp
                };

                var sendMail = await smtpTransport.sendMail(mailOptions);
            } else {
                var data = "OTP does not created"
            }
        } else {
            console.log("Username is invalid")
            var invalid = "Username is invalid"
        }
        return { find, data, invalid, sendMail }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Forgot password:-

const forgotPassServices = async(payLoad) => {
    try {
        var findData = await user.findOne({ email: payLoad.username });
        if (!findData) {
            return "User does not exist"
        } else {
            if (findData.otp == payLoad.otp) {
                if (payLoad.password == payLoad.confirmPassword) {
                    let hashObj = functions.hashPassword(payLoad.password);
                    console.log(hashObj)
                    delete password;
                    payLoad.salt = hashObj.salt;
                    payLoad.password = hashObj.hash;
                    var updateData = await user.updateOne({ email: payLoad.username }, {
                        $set: {
                            password: payLoad.password,
                            salt: payLoad.salt
                        }
                    }, { new: true });
                } else {
                    var confirm = "Confirm password is not correct"
                }
            } else {
                console.log("OTP is not correct")
                var verify = "OTP is not correct"
            }
        }
        return { updateData, findData, confirm, verify };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Booking:-

const userBooking = async(payLoad) => {
    try {
        var findDriver = await driver.findOne({ email: payLoad.driver });
        var findUser = await user.findOne({ email: payLoad.username });
        if (findDriver) {
            if (findUser) {
                if (payLoad.passenger <= 5) {
                    var userData = await booking.create(payLoad);
                } else {
                    var noofpassenger = "More than 5 passengers are not allowed";
                    console.log("More than 5 passengers are not allowed")
                }
            } else {
                var passenger = "User is not registered";
                console.log("User is not registered")
            }
        } else {
            var drivername = "Driver is not registered";
            console.log("Driver is not registered")
        }
        return { userData, passenger, drivername, noofpassenger };
    } catch (error) {
        console.error(error)
        throw error
    }
}


//Get user history

const getUserHistory = async(token) => {
    console.log("Get user history")
    try {
        console.log("getUserHistory")
        var findData = await userAuth.findOne({ accessToken: token });
        var userData = await booking.find({ username: findData.username });
        console.log(userData)
        console.log(userData.length)
        if (!userData.length) {
            console.log("User history is empty")
            var empty = "User history is empty"
            return { empty }
        } else {
            return { userData };
        }
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//User Logout

const userLogout = async(token) => {
    try {
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            console.log("Access token not found")
        }
        token.accessToken = decodeCode.accessToken
        let deletetoken = await userAuth.deleteOne(token.accessToken)
        return deletetoken
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//..................................................User onboard complete..........................................................................................
module.exports = { userSignup, getAllUsers, deleteAllUsers, verifyOTPServices, userPaymentDetails, userSignIn, signinViaTokenService, updateProfile, resetPassServices, userVerify, forgotPassServices, userBooking, getUserHistory, userLogout }