const mongoose = require('mongoose')
const Review = require('./reviews')
const Schema = mongoose.Schema;
const User = require("./user")
const opts = { toJSON : {
    virtuals : true
}}

const ImageSchema = new Schema({
    url : String ,
    filename : String 
}) ;

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_300')
})

const Campgroundschema = new Schema(
    {
        title: String,
        images: [ImageSchema] ,

        geometry: {
            type: {
              type: String, 
              enum: ['Point'], 
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            } 
         } ,

        price: Number,
        description: String,
        location: String,
        author: {
            type:Schema.Types.ObjectId ,
            ref : "User"
        } , 
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: "Review"
        }]
    } , opts
);

Campgroundschema.post('findOneAndDelete', async function (doc) {
    //console.log("Deleted !") ;
    if (doc) {
        console.log(doc)
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })


        console.log("done ?")
    }
})


Campgroundschema.virtual('properties.popUpMarkup').get(function(){
        return `<a href="/campgrounds/${this._id}"><h3>${this.title}</h3></a>
        <p>${this.description.substring(0,50)}...</p>
        `
})

module.exports = mongoose.model('Campground', Campgroundschema);