const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    popularityScore: Number,
    weight: Number,
    images: {
        yellow: {type: String},
        rose: {type: String},
        white: {type: String},
    },
});

module.exports = mongoose.model("Product", productSchema);