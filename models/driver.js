const mongoose = require('mongoose')
const Schema = mongoose.Schema

let driverSchema = new Schema({
    name: String,
    mobile: String,
    email: String,
    pin: String,
    isApproved: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('driverSchema', driverSchema)