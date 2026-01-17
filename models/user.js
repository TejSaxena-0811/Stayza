const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
    // no need to separately add username and password, passportLocalMongoose does that automatically by using the plugin below.
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , userSchema);