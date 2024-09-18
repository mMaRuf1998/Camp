const mongoose = require('mongoose')
const Review = require('./reviews')
const Schema = mongoose.Schema;
const User = require("./user")

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
    }
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

module.exports = mongoose.model('Campground', Campgroundschema);