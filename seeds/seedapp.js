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
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '66dd9216464e744ce886dcd4' ,
            title: `${sample(descriptors)},${sample(places)}`,
            location: `${cities[random1000].city},${cities[random1000].state}`,
            image: 'https://picsum.photos/750/500',
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque officia labore magni recusandae nobis quisquam cumque asperiores, temporibus magnam ipsam velit. Repellendus dicta velit inventore saepe cumque totam dolorem soluta?",
            price: price,
            
        });

        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })
