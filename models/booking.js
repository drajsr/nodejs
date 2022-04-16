const mongoose = require('mongoose')
const Schema = mongoose.Schema

let bookingSchema = new Schema({
    username: String,
    driver: String,
    pickupData: {
        address: String,
        latitude: String,
        longitude: String
    },
    deliveryData: {
        address: String,
        latitude: String,
        longitude: String
    },
    passenger: Number,
    luggage: Number,
    stroller: Number,
    distance: Number,
    total_fare: Number
})

module.exports = mongoose.model('booking', bookingSchema) 