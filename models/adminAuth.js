const mongoose = require('mongoose')
const Schema = mongoose.Schema

let adminAuthSchema = new Schema({
    username: String,
    accessToken: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('adminAuthSchema', adminAuthSchema) 