const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("" , null),
        category: Joi.array()
        .items(
            Joi.string().valid(
                "trending",
                "rooms",
                "altitude",
                "castles",
                "pools",
                "camping",
                "farms",
                "arctic",
                "beach",
                "boats"
            )
        )
        .default([]), // if nothing is selected, then default array is empty
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
})


const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})



module.exports = {listingSchema , reviewSchema};