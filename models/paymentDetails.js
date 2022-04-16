const mongoose = require('mongoose')
const Schema = mongoose.Schema

let paymentDetailsSchema = new Schema({
    username: String,
    cardNo: String,
    cvv: String,
    salt1: String,
    salt2: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('paymentDetailsSchema', paymentDetailsSchema) 