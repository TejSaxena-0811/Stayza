const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String    
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    
    reviews: [ // this is an array because there can be multiple reviews on a listing.
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

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
    },
    
    category: [{
        type: String,
        enum: ["trending","rooms","altitude","castles","pools","camping","farms","arctic","beach","boats"] // enum is used to restrict a field to allow only specific values.
    }]
})



// middleware
listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})


const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;