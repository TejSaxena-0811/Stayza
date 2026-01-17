const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/roamrest";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
})


const initDB = async() => {
    await Listing.deleteMany({}); // remove any pre-existing data first.
    initData.data = initData.data.map((obj) => ({...obj , owner: "696b65a4b1656819d0a5f9c0"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();