const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/campdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log('Database connected');
});

const sample = data => data[Math.floor(Math.random() * data.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);

        const camp = new Campground({
            title: `${sample(descriptors)},${sample(places)}`,
            location: `${cities[random1000].city},${cities[random1000].state}`,

        });

        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })
