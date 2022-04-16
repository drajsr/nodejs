const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
let userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: Number,
    password: String,
    salt: String,
    otp: { type: Number, default: null },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('userSchema', userSchema)